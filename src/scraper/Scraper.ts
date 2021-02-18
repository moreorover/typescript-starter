import { BrowserClient } from "./BrowserClient";
import { ItemAd, ParserInstructions } from "./types";
import { HTMLElement } from "node-html-parser";
import { Url } from "./../models/Url";
import { Channel, Client, MessageEmbed, TextChannel } from "discord.js";
const nodeHtmlToImage = require("node-html-to-image");
// const { v4: uuidv4 } = require("uuid");
const Discord = require("discord.js");
export interface Scraper {
  url: Url;
  browser: BrowserClient;
  currentUrl: string;
  pageNumber: number;
  parserInstructions: ParserInstructions;
  adsLoaded: boolean;
  paginationLoaded: boolean;
  ads: ItemAd[];
  discordBot: Client;
  start(): Promise<ItemAd[]>;
  parseAdItem(adElement: HTMLElement): Promise<ItemAd | undefined>;
  // saveImageOfAnElement(htmlElement: HTMLElement): void;
  // parse(htmlElement: HTMLElement, callback: Function): string | number;
}

export class ScraperImplementation implements Scraper {
  url: Url;
  browser: BrowserClient;
  currentUrl: string;
  pageNumber: number;
  adsLoaded: boolean;
  paginationLoaded: boolean;
  parserInstructions: ParserInstructions;
  ads: ItemAd[] = [];
  discordBot: Client;

  constructor(
    url: Url,
    pageNumber: number,
    browser: BrowserClient,
    parserInstructions: ParserInstructions,
    discordBot: Client
  ) {
    this.url = url;
    this.pageNumber = pageNumber;
    this.browser = browser;
    this.currentUrl = url.url;
    this.parserInstructions = parserInstructions;
    this.adsLoaded = false;
    this.paginationLoaded = false;
    this.discordBot = discordBot;
  }

  async start(): Promise<ItemAd[]> {
    await this.browser.openTab();
    console.log(`Navigating to: ${this.currentUrl}`);
    await this.browser.navigateTo(this.currentUrl);
    await this.browser
      .waitForFunction(this.parserInstructions.waitForAds)
      .then(() => (this.adsLoaded = true))
      .catch(() =>
        console.error(
          `Could not load ads for: \n -- ${this.currentUrl} -- \n Please check selectors.`
        )
      );

    if (this.adsLoaded) {
      const content: HTMLElement = await this.browser.getHtmlContent();
      const ads:
        | HTMLElement[]
        | void = this.parserInstructions.adElements(content, () =>
        console.log("Parsing Error")
      );

      if (ads) {
        const itemAds: ItemAd[] = await Promise.all(
          ads
            .map(
              async (adElement): Promise<ItemAd | undefined> =>
                await this.parseAdItem(adElement)
            )
            .filter((adItem) => adItem !== undefined)
        );
        this.ads = this.ads.concat(itemAds);
      }
    }

    await this.browser
      .waitForFunction(this.parserInstructions.waitForPagination)
      .then(() => (this.paginationLoaded = true))
      .catch(() =>
        console.error(
          `Could not load pagination for: \n -- ${this.currentUrl} -- \n Please check selectors.`
        )
      );

    if (this.paginationLoaded) {
      const content: HTMLElement = await this.browser.getHtmlContent();
      if (
        this.parserInstructions.nextPageAvailable(content, () =>
          console.error("Pagination parsing error")
        )
      ) {
        let nextPageUrl: {
          nextUrl: string;
          nextPageNumber: number;
        } = this.parserInstructions.nextPageUrl(
          this.currentUrl,
          this.pageNumber
        );
        this.currentUrl = nextPageUrl.nextUrl;
        this.pageNumber = nextPageUrl.nextPageNumber;
        this.browser.closeTab();
        await this.start();
      }
    }
    await this.browser.closeBrowser();
    return this.ads;
  }

  async parseAdItem(adElement: HTMLElement): Promise<ItemAd | undefined> {
    let title = this.parserInstructions.title(adElement, () =>
      console.error("Could not parse title")
    );
    let itemUrl = this.parserInstructions.url(adElement, () =>
      console.error("Could not parse item url")
    );
    let price = this.parserInstructions.price(adElement, async () => {
      console.error("Could not parse price");
      const image = await nodeHtmlToImage({
        html: adElement.outerHTML,
      });

      const exampleEmbed: MessageEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(title)
        .attachFiles([{ name: "image.png", attachment: image }])
        .setImage("attachment://image.png")
        .setTimestamp();

      const channel: Channel = this.discordBot.channels.cache.get(
        "812040400343924777"
      );
      (channel as TextChannel).send(exampleEmbed);
    });
    let upc = this.parserInstructions.upc(adElement, () =>
      console.error("Could not parse upc")
    );
    let image = this.parserInstructions.image(adElement, () =>
      console.error("Could not parse image url")
    );

    if (title && itemUrl && price && upc && image) {
      return {
        title: title,
        itemUrl: itemUrl,
        price: price,
        upc: upc,
        image: image,
        whereFound: this.currentUrl,
      };
    }

    return undefined;
  }

  // saveImageOfAnElement(htmlElement: HTMLElement) {
  //   nodeHtmlToImage({
  //     output: "./err/" + uuidv4() + ".png",
  //     html: htmlElement.outerHTML,
  //   });
  // }
}
