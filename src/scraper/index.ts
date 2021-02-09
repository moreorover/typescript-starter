const puppeteer = require("puppeteer");
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { getConnection } from "typeorm";
import { Url } from "./../models/Url";

export const scraper = async (): Promise<Url[]> => {
  const urls = await getConnection()
    .createQueryBuilder()
    .select("url")
    .from(Url, "url")
    .where("url.updatedAt < :time", {
      time: dateTimeInPast(2),
    })
    .getMany();

  if (urls.length > 0) {
    let browserClient: Browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
    });

    for (let url of urls) {
      let urlPage: Page = await browserClient.newPage();
      await urlPage.goto(url.url, { waitUntil: "networkidle2" });
      await urlPage.close();
    }
    await browserClient.close();
  }

  return urls;
};

function dateTimeInPast(hours: number): Date {
  const curTime = new Date();
  curTime.setHours(curTime.getHours() - hours);
  return curTime;
}
