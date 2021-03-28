import { ParsedAd } from "./ParsedItem";
import { AdParserService } from "./AdParserService";
import { HTMLElement } from "node-html-parser";
import { DiscordBot } from "../DiscordBot";
import { ParserInstructions } from "./ParserInstructions";
import { ParserService } from "./ParserService";

export abstract class PageParserService extends ParserService {
  page: HTMLElement;
  adElements: HTMLElement[];
  adParserServices: AdParserService[];
  parsedItems: ParsedAd[];

  constructor(
    instructions: ParserInstructions,
    discordBot: DiscordBot,
    page: HTMLElement
  ) {
    super(instructions, discordBot);
    this.page = page;
  }

  parseAdElements() {
    this.adElements = this.tryParsePage(
      this.instructions.adElements,
      "ads",
      this.page
    );
  }

  mapParsedAdsToAdParserService() {
    this.adParserServices = this.adElements.map(
      (adElement) =>
        new AdParserService(adElement, this.instructions, this.discordBot)
    );
  }

  getAds() {
    this.adParserServices.forEach((element) => element.processAd());
    this.parsedItems = this.adParserServices
      .filter((element) => element.isParsedAdValid())
      .map((element) => element.parsedAd);
  }

  countAds(): number {
    return this.adElements.length;
  }

  nextPageAvailable(): boolean {
    return true;
  }
}
