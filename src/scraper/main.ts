import { BrowserClient, Pup } from "./BrowserClient";
import { Scraper, ScraperImplementation } from "./Scraper";
import { creationWatchesInstructions } from "./CreationWatches";
import { Url } from "./../models/Url";
import { ItemAd } from "./types";
import { processItemAd } from "./../processing/ItemProcessing";
import { Client } from "discord.js";

export const mainScraper = async (discordBot: Client) => {
  const urlToScrape: Url = await Url.findByLikeUrl(
    "creationwatches",
    dateTimeInPast(2)
  );
  if (urlToScrape) {
    const browser: BrowserClient = new Pup({
      headless: false,
      // slowMo: 10,
    });

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
  }
};

export function dateTimeInPast(hours: number): Date {
  const curTime = new Date();
  curTime.setHours(curTime.getHours() - hours);
  return curTime;
}
