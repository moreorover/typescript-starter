import { DiscordBot } from "./../DiscordBot";
import { AdParserService } from "./AdParserService";
import { ParsedAd } from "./ParsedItem";
import { DatabaseReader } from "./../DataBaseReader";
import { BrowserClient, Pup } from "./../../scraper/BrowserClient";
import { Url } from "./../../models/Url";
import { ParserInstructions } from "./ParserInstructions";

type SpiderMeta = {
  currentPage: string;
  nextPage: string | null;
  pageNumber: number;
  adsLoaded: boolean;
  paginationLoaded: boolean;
};

export class Spider {
  urlContains: string;
  databaseReader: DatabaseReader;
  parserInstructions: ParserInstructions;
  browser: BrowserClient;
  spiderMeta: SpiderMeta;
  discordBot: DiscordBot;
  adParserService: AdParserService;

  url: Url;

  constructor(
    urlContains: string,
    databaseReader: DatabaseReader,
    parserInstructions: ParserInstructions,
    discordBot: DiscordBot
  ) {
    this.urlContains = urlContains;
    this.databaseReader = databaseReader;
    this.parserInstructions = parserInstructions;
    this.browser = new Pup();
    this.discordBot = discordBot;
    this.adParserService = new AdParserService(parserInstructions, discordBot);
  }

  async start() {
    this.url = await this.databaseReader.findByLikeUrl(this.urlContains);
    if (this.url) {
      this.spiderMeta = {
        currentPage: this.url.url,
        nextPage: null,
        pageNumber: 1,
        adsLoaded: false,
        paginationLoaded: false,
      };
      try {
        await this.crawl();
      } finally {
        await this.browser.closeBrowser();
      }
    }
  }

  async parseAds() {
    this.parserInstructions
      .adElements(await this.browser.getHtmlContent())
      .forEach((adElement) => this.adParserService.processAd(adElement));
  }

  parseNextPageUrl() {}

  processItem(item: ParsedAd) {}

  async crawl() {
    await this.browser.navigateTo(this.spiderMeta.currentPage);
    this.spiderMeta.adsLoaded = await this.browser.waitForFunctionBoolean(
      this.parserInstructions.waitForAds,
      this.parserInstructions.waitOptions
    );

    this.spiderMeta.paginationLoaded = await this.browser.waitForFunctionBoolean(
      this.parserInstructions.waitForPagination,
      this.parserInstructions.waitOptions
    );

    this.spiderMeta.adsLoaded && this.parseAds();

    this.spiderMeta.paginationLoaded && this.parseNextPageUrl();
  }
}
