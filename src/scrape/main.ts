import { creationWatchesInstructions } from "./../scraper/CreationWatches";
import { Scraper } from "./Scraper";
import { DatabaseWriter } from "./DataBaseWriter";
import { DatabaseReader } from "./DataBaseReader";
import { DiscordBot } from "./DiscordBot";

export function mainScrapingProcess() {
  const discordBot: DiscordBot = new DiscordBot();
  const databaseReader: DatabaseReader = new DatabaseReader();
  const databaseWriter: DatabaseWriter = new DatabaseWriter();

  const creationWatchesScraper: Scraper = new Scraper(
    "Creation Watches",
    "creationwatches",
    databaseReader,
    databaseWriter,
    discordBot,
    creationWatchesInstructions,
    1
  );
}
