import { DiscordBot } from "./../DiscordBot";
import { ParserService } from "./ParserService";
import { HTMLElement } from "node-html-parser";
import { ParsedAd } from "./ParsedItem";
import { ParserInstructions } from "./ParserInstructions";

export class AdParserService extends ParserService {
  adElement: HTMLElement;
  parsedAd: ParsedAd;

  constructor(
    adElement: HTMLElement,
    instructions: ParserInstructions,
    discordBot: DiscordBot
  ) {
    super(instructions, discordBot);
    this.adElement = adElement;
  }

  parseAd(): void {
    this.parsedAd.title = this.tryParseSnippet(
      this.instructions.title,
      "title",
      this.adElement
    );
    this.parsedAd.price = this.tryParseSnippet(
      this.instructions.price,
      "price",
      this.adElement
    );
    this.parsedAd.url = this.tryParseSnippet(
      this.instructions.url,
      "url",
      this.adElement
    );
    this.parsedAd.upc = this.tryParseSnippet(
      this.instructions.upc,
      "upc",
      this.adElement
    );
    this.parsedAd.image = this.tryParseSnippet(
      this.instructions.image,
      "image",
      this.adElement
    );
  }

  isParsedAdValid(): boolean {
    return (
      (this.parsedAd.title !== undefined || this.parsedAd.title.length > 0) &&
      (this.parsedAd.price !== undefined || this.parsedAd.price > 0) &&
      (this.parsedAd.url !== undefined || this.parsedAd.url.length > 0) &&
      (this.parsedAd.upc !== undefined || this.parsedAd.upc.length > 0)
    );
  }
}
