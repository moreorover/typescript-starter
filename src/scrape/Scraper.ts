import { ScraperService, PaginatedScraperService } from "./ScraperService";
import { BrowserClient, Pup } from "./../scraper/BrowserClient";
import { ParserInstructions } from "./../scraper/types";
import { DiscordBot } from "./DiscordBot";
import { DatabaseWriter } from "./DataBaseWriter";
import { DatabaseReader } from "./DataBaseReader";
import { Url } from "../models/Url";

export class ScraperMeta {
  currentPageUrl: string;
  currentPageNumber: number;
  loaded: { adElements: boolean; pagination: boolean; nextPage: boolean };
  adsFound: number;
  adsSuccessfullyParsed: number;
  adsFailedParsed: number;
}

export class Scraper {
  url: Url;
  readonly startPageNumber: number;
  scraperMeta: ScraperMeta;
  readonly scraperName: string;
  readonly urlContains: string;
  readonly browser: BrowserClient;
  readonly databaseReader: DatabaseReader;
  readonly databaseWriter: DatabaseWriter;
  readonly discordBot: DiscordBot;
  readonly scraperService: ScraperService;
  readonly parserInstructions: ParserInstructions;
  commandHistory: Command[];

  constructor(
    scraperName: string,
    urlContains: string,
    databaseReader: DatabaseReader,
    databaseWriter: DatabaseWriter,
    discordBot: DiscordBot,
    parserInstructions: ParserInstructions,
    startPageNumber: number
  ) {
    this.scraperName = scraperName;
    this.urlContains = urlContains;
    this.browser = new Pup();
    this.databaseReader = databaseReader;
    this.databaseWriter = databaseWriter;
    this.discordBot = discordBot;
    this.parserInstructions = parserInstructions;
    this.scraperService = new PaginatedScraperService(this);
    this.startPageNumber = startPageNumber;
  }

  async fetchUrl(): Promise<void> {
    const curTime = new Date();
    curTime.setHours(
      curTime.getHours() - Number(process.env.SCRAPING_FREQUENCY_IN_HOURS)
    );
    this.url = await this.databaseReader.findByLikeUrl(
      this.urlContains,
      curTime
    );

    if (this.url !== undefined) {
      this.scraperMeta.currentPageNumber = this.startPageNumber;
      this.scrape();
    }
  }

  async takeCommand(command: Command) {
    command.execute();
    this.commandHistory.push(command);
  }

  async scrape(): Promise<void> {
    try {
      this.browser.start();
      this.scraperService.scrape();
    } finally {
      this.browser.closeBrowser();
    }
  }
}
