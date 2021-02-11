const puppeteer = require("puppeteer");
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import {
  ElementHandle,
  JSHandle,
} from "puppeteer/lib/cjs/puppeteer/common/JSHandle";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { getConnection } from "typeorm";
import { Url } from "./../models/Url";

const waitForAdsToRender = async (page: Page): Promise<boolean | JSHandle> => {
  return await page
    .waitForFunction(
      () => document.querySelectorAll("div.product-box").length > 0
    )
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const waitForPaginationToRender = async (page: Page): Promise<boolean> => {
  return await page
    .waitForFunction(
      () => document.querySelectorAll("div.display-heading-box p").length
    )
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const parse = (pageNum: number, url: string): object[] => {
  let ads = [];
  document.querySelectorAll("div.product-box").forEach((ad: Element) => {
    let title = ad.querySelector("h3.product-name a").textContent;
    let itemUrl = ad.querySelector("h3.product-name a").getAttribute("href");
    let price = Number(
      ad
        .querySelector("p.product-price span")
        .textContent.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)
    );
    let upc =
      "CW_" + ad.querySelector("p.product-model-no").textContent.split(": ")[1];
    let img = ad.querySelector("img.product-image").getAttribute("src");
    console.log(title);
    ads.push({
      title: title,
      url: itemUrl,
      price: price,
      upc: upc,
      img: img,
      pageNum: pageNum,
      whereFound: url,
    });
  });
  return ads;
};

const extractItemsFromPage = async (
  browser: Browser,
  url: string,
  pageNum: number
): Promise<object[]> => {
  let urlPage: Page = await browser.newPage();
  await urlPage.goto(url, { waitUntil: "networkidle2" });

  let ads: object[] = [];
  let paginationNumbers: number[] = [];

  if (await waitForAdsToRender(urlPage)) {
    ads = await urlPage.evaluate(parse, pageNum, url);
  }

  if (await waitForPaginationToRender(urlPage)) {
    paginationNumbers = await urlPage.evaluate(() => {
      let pagination: string = document.querySelector(
        "div.display-heading-box p"
      ).textContent;
      return pagination
        .split(" ")
        .filter((e) => +e)
        .map(Number);
    });
  }

  await urlPage.close();

  if (paginationNumbers[1] !== paginationNumbers[2]) {
    // scraper next page
    // https://www.creationwatches.com/products/citizen-74/index-1-5d.html?currency=GBP
    let urlSplit = url.split("/index-");
    let nextPageUrl =
      urlSplit[0] + "/index-" + ++pageNum + "-5d.html?currency=GBP";
    return ads.concat(
      await extractItemsFromPage(browser, nextPageUrl, pageNum)
    );
  } else {
    return ads;
  }
};

export const creationWatches = async () => {
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
    for (let url of urls) {
      let extractedItems: object[] = await extractItemsFromPage(
        browserClient,
        url.url,
        1
      );
      console.log(url.url);
      console.log(extractedItems.length);
    }
    await browserClient.close();
  }
};

function dateTimeInPast(hours: number): Date {
  const curTime = new Date();
  curTime.setHours(curTime.getHours() - hours);
  return curTime;
}
