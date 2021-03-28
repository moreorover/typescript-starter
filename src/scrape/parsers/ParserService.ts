import { DiscordBot } from "./../DiscordBot";
const nodeHtmlToImage = require("node-html-to-image");
import { HTMLElement } from "node-html-parser";
import { ParserInstructions } from "./ParserInstructions";
var prettifyHtml = require("prettify-html");
var fs = require("fs");

export abstract class ParserService {
  instructions: ParserInstructions;
  discordBot: DiscordBot;

  constructor(instructions: ParserInstructions, discordBot: DiscordBot) {
    this.instructions = instructions;
    this.discordBot = discordBot;
  }

  tryParsePage(parseFunction: Function, actionName: string, html: HTMLElement) {
    try {
      return parseFunction(html);
    } catch (e) {
      this.recordError(actionName);
    }
  }

  tryParseSnippet(
    parseFunction: Function,
    actionName: string,
    html: HTMLElement
  ) {
    try {
      return parseFunction(html);
    } catch (e) {
      this.recordError(actionName, html.outerHTML);
    }
  }

  async recordError(actionName: string, html: string = "") {
    this.discordBot.sendEmbeddedWithImageAndText(
      "812040400343924777",
      actionName,
      prettifyHtml(html),
      await this.htmlToImage(html)
    );
  }

  async htmlToImage(
    html: string
  ): Promise<string | Buffer | (string | Buffer)[]> {
    return await nodeHtmlToImage({
      html: html,
    });
  }
}
