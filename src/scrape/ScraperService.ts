import { ItemAd } from "src/scraper/types";
import { Scraper } from "./Scraper";
import { HTMLElement } from "node-html-parser";

export interface ScraperService {
  scraper: Scraper;
  scrape(): Promise<void>;
}

/**
 * This Simple Parser manages the scraping of a paginated website with with many ads.
 *
 * @export
 * @class PaginatedScraperService
 * @implements {ScraperService}
 */
export class PaginatedScraperService implements ScraperService {
  scraper: Scraper;

  constructor(scraper: Scraper) {
    this.scraper = scraper;
  }

  async scrape() {
    console.log(`Navigating to: ${this.scraper.scraperMeta.currentPageUrl}`);
    await this.scraper.browser.navigateTo(
      this.scraper.scraperMeta.currentPageUrl
    );
    await this.scraper.browser
      .waitForFunction(
        this.scraper.parserInstructions.waitForAds,
        this.scraper.parserInstructions.waitOptions
      )
      .then(() => (this.scraper.scraperMeta.loaded.adElements = true))
      .catch(() => {
        throw new Error("Error while loading ads.");
      });

    if (this.scraper.scraperMeta.loaded.adElements) {
      const content: HTMLElement = await this.scraper.browser.getHtmlContent();
      const ads:
        | HTMLElement[]
        | void = this.scraper.parserInstructions.adElements(content, () =>
        console.log("Parsing Error")
      );

      if (ads) {
        // const itemAds: ItemAd[] = await Promise.all(
        //   ads
        //     .map(
        //       async (adElement): Promise<ItemAd | undefined> =>
        //         await this.parseAdItem(adElement)
        //     )
        //     .filter((adItem) => adItem !== undefined)
        // );
        // this.ads = this.ads.concat(itemAds);
      }
    }
  }

  async parseAdItem(adElement: HTMLElement): Promise<ItemAd | undefined> {
    let title = this.scraper.parserInstructions.title(adElement, () =>
      console.error("Could not parse title")
    );
    let itemUrl = this.scraper.parserInstructions.url(adElement, () =>
      console.error("Could not parse item url")
    );
    let price = this.scraper.parserInstructions.price(adElement, async () => {
      console.error("Could not parse price");
    });
    let upc = this.scraper.parserInstructions.upc(adElement, () =>
      console.error("Could not parse upc")
    );
    let image = this.scraper.parserInstructions.image(adElement, () =>
      console.error("Could not parse image url")
    );

    if (title && itemUrl && price && upc && image) {
      return {
        title: title,
        itemUrl: itemUrl,
        price: price,
        upc: upc,
        image: image,
        whereFound: "", //this.currentUrl,
      };
    }

    return undefined;
  }
}
