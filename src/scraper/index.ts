const puppeteer = require("puppeteer");
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { getConnection } from "typeorm";
import { Url } from "./../models/Url";

const extractItemsFromPage = async (
  browser: Browser,
  url: string,
  pageNum: number
): Promise<object[]> => {
  let urlPage: Page = await browser.newPage();
  await urlPage.goto(url, { waitUntil: "networkidle2" });
  await urlPage.waitForSelector("div.product-box");

  let pageObjectives = await urlPage.evaluate(
    (pageNumber, pageUrl) => {
      let ads = [];
      let adElements = document.querySelectorAll("div.product-box");
      adElements.forEach((ad: Element) => {
        let title = ad.querySelector("h3.product-name a").textContent;
        let itemUrl = ad
          .querySelector("h3.product-name a")
          .getAttribute("href");
        let price = Number(
          ad
            .querySelector("p.product-price span")
            .textContent.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)
        );
        let upc =
          "CW_" +
          ad.querySelector("p.product-model-no").textContent.split(": ")[1];
        let img = ad.querySelector("img.product-image").getAttribute("src");
        ads.push({
          title: title,
          url: itemUrl,
          price: price,
          upc: upc,
          img: img,
          pageNum: pageNumber,
          whereFound: pageUrl,
        });
      });

      let pagination = document.querySelector("div.display-heading-box p")
        .textContent;
      let paginationNumbers = pagination
        .split(" ")
        .filter((e) => +e)
        .map(Number);
      return { ads: ads, pagination: paginationNumbers };
    },
    pageNum,
    url
  );

  await urlPage.close();
  let result = [];
  if (pageObjectives.pagination[1] !== pageObjectives.pagination[2]) {
    // scraper next page
    // https://www.creationwatches.com/products/citizen-74/index-1-5d.html?currency=GBP
    let urlSplit = url.split("/index-");
    let nextPageUrl =
      urlSplit[0] + "/index-" + ++pageNum + "-5d.html?currency=GBP";
    result = result.concat(pageObjectives.ads);
    return result.concat(
      await extractItemsFromPage(browser, nextPageUrl, pageNum)
    );
  } else {
    return pageObjectives.ads;
  }
};

export const scraper = async () => {
  const urls = await getConnection()
    .createQueryBuilder()
    .select("url")
    .from(Url, "url")
    .where("url.updatedAt < :time AND url.url like :url", {
      time: dateTimeInPast(2),
      url: `%creationwatches%`,
    })
    .getMany();

  if (urls.length > 0) {
    let browserClient: Browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
    });
    let extractedItems = [];
    for (let url of urls) {
      extractedItems = extractedItems.concat(
        await extractItemsFromPage(browserClient, url.url, 1)
      );
    }
    await browserClient.close();
    console.log(extractedItems);
    console.log(extractedItems.length);
  }
};

function dateTimeInPast(hours: number): Date {
  const curTime = new Date();
  curTime.setHours(curTime.getHours() - hours);
  return curTime;
}
