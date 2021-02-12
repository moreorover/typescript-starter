const puppeteer = require("puppeteer");
import { HTMLElement, parse } from "node-html-parser";
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { getConnection } from "typeorm";
import { Url } from "./../models/Url";

const waitForAdsToRender = async (page: Page): Promise<boolean> => {
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

interface ItemAd {
  title: string;
  price: number;
  upc: string;
  image: string;
  itemUrl: string;
}

interface ParserDetails {
  adElements(document: HTMLElement): HTMLElement[];
  title(adElement: HTMLElement): string;
  price(adElement: HTMLElement): number;
  upc(adElement: HTMLElement): string;
  image(adElement: HTMLElement): string;
  url(adElement: HTMLElement): string;
}

const creationWatchesParser: ParserDetails = {
  adElements: (document: HTMLElement) =>
    document.querySelectorAll("div.product-box"),
  title: (adElement: HTMLElement) =>
    adElement.querySelector("h3.product-name a").textContent,
  price: (adElement: HTMLElement) =>
    Number(
      adElement
        .querySelector("p.product-price span")
        .textContent.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)
    ),
  upc: (adElement: HTMLElement) =>
    "CW_" +
    adElement.querySelector("p.product-model-no").textContent.split(": ")[1],
  image: (adElement: HTMLElement) =>
    adElement.querySelector("img.product-image").getAttribute("src"),
  url: (adElement: HTMLElement) =>
    adElement.querySelector("h3.product-name a").getAttribute("href"),
};

const parseHtmlToAdElements = (
  htmlElement: HTMLElement,
  callback: (htmlElement: HTMLElement) => HTMLElement[]
): HTMLElement[] => {
  return callback(htmlElement);
};

const adElementProcessor = (htmlElement: HTMLElement): ItemAd => {
  return {
    title: creationWatchesParser.title(htmlElement),
    itemUrl: creationWatchesParser.url(htmlElement),
    price: creationWatchesParser.price(htmlElement),
    upc: creationWatchesParser.upc(htmlElement),
    image: creationWatchesParser.image(htmlElement),
  };
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
    let pageContent: string = await urlPage.content();
    const root: HTMLElement = parse(pageContent, {
      lowerCaseTagName: false, // convert tag name to lower case (hurt performance heavily)
      comment: false, // retrieve comments (hurt performance slightly)
      blockTextElements: {
        script: true, // keep text content when parsing
        noscript: true, // keep text content when parsing
        style: true, // keep text content when parsing
        pre: true, // keep text content when parsing
      },
    });

    let adElements: HTMLElement[] = parseHtmlToAdElements(
      root,
      creationWatchesParser.adElements
    );

    let ads: ItemAd[] = adElements.map(adElementProcessor);

    console.log(ads);
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
