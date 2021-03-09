import { BrowserClient, Pup } from "./BrowserClient";
import { Scraper, ScraperImplementation } from "./Scraper";
import { creationWatchesInstructions } from "./CreationWatches";
import { Url } from "./../models/Url";
import { ItemAd } from "./types";
import { processItemAd } from "./../processing/ItemProcessing";
import { Client } from "discord.js";
import "dotenv-safe/config";

export const mainScraper = async (discordBot: Client) => {
  const urlToScrape: Url = await Url.findByLikeUrl(
    "creationwatches",
    dateTimeInPast()
  );
  if (urlToScrape) {
    const browser: BrowserClient = new Pup();
    try {
      const creationWatchesScraper: Scraper = new ScraperImplementation(
        urlToScrape,
        1,
        browser,
        creationWatchesInstructions,
        discordBot
      );

      const ads: ItemAd[] = await creationWatchesScraper.start();

      // console.log(ads);
      console.log(`Found ${ads.length} ads in total.`);
      ads.forEach(processItemAd);

      urlToScrape.updatedAt = new Date();
      urlToScrape.save();
    } finally {
      browser.closeBrowser();
    }
  }
};

export function dateTimeInPast(): Date {
  const curTime = new Date();
  curTime.setHours(
    curTime.getHours() - Number(process.env.SCRAPING_FREQUENCY_IN_HOURS)
  );
  return curTime;
}
