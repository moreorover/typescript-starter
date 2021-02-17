import { BrowserClient } from "./BrowserClient";
import { ItemAd, ParserInstructions } from "./types";
import { HTMLElement } from "node-html-parser";
import { Url } from "./../models/Url";
// const nodeHtmlToImage = require("node-html-to-image");
// const { v4: uuidv4 } = require("uuid");
export interface Scraper {
  url: Url;
  browser: BrowserClient;
  currentUrl: string;
  pageNumber: number;
  parserInstructions: ParserInstructions;
  adsLoaded: boolean;
  paginationLoaded: boolean;
  ads: ItemAd[];
  start(): Promise<ItemAd[]>;
  parseAdItem(adElement: HTMLElement): ItemAd | undefined;
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

  constructor(
    url: Url,
    pageNumber: number,
    browser: BrowserClient,
    parserInstructions: ParserInstructions
  ) {
    this.url = url;
    this.pageNumber = pageNumber;
    this.browser = browser;
    this.currentUrl = url.url;
    this.parserInstructions = parserInstructions;
    this.adsLoaded = false;
    this.paginationLoaded = false;
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
        const itemAds: ItemAd[] = ads
          .map((adElement) => this.parseAdItem(adElement))
          .filter((adItem) => adItem !== undefined);
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

  parseAdItem(adElement: HTMLElement): ItemAd | undefined {
    // nodeHtmlToImage({
    //   output: "./err/" + uuidv4() + ".png",
    //   html: adElement.outerHTML,
    // });

    let title = this.parserInstructions.title(adElement, () =>
      console.error("Could not parse title")
    );
    let itemUrl = this.parserInstructions.url(adElement, () =>
      console.error("Could not parse item url")
    );
    let price = this.parserInstructions.price(adElement, () =>
      console.error("Could not parse price")
    );
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
