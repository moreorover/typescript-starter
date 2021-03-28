import { DiscordBot } from "./../DiscordBot";
import { ParserService } from "./ParserService";
import { HTMLElement } from "node-html-parser";
import { ParsedAd } from "./ParsedItem";
import { ParserInstructions } from "./ParserInstructions";

export class AdParserService extends ParserService {
  parsedAd: ParsedAd;

  constructor(instructions: ParserInstructions, discordBot: DiscordBot) {
    super(instructions, discordBot);
    this.parsedAd = {
      title: undefined,
      price: undefined,
      upc: undefined,
      url: undefined,
      image: undefined,
    };
  }

  processAd(adElement: HTMLElement): void {
    this.parsedAd.title = this.tryParseSnippet(
      this.instructions.title,
      "title",
      adElement
    );
    this.parsedAd.price = this.tryParseSnippet(
      this.instructions.price,
      "price",
      adElement
    );
    this.parsedAd.url = this.tryParseSnippet(
      this.instructions.url,
      "url",
      adElement
    );
    this.parsedAd.upc = this.tryParseSnippet(
      this.instructions.upc,
      "upc",
      adElement
    );
    this.parsedAd.image = this.tryParseSnippet(
      this.instructions.image,
      "image",
      adElement
    );

    if (this.isParsedAdValid()) {
      console.log(this.parsedAd);
    }
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
