import { HTMLElement } from "node-html-parser";

export interface ParserInstructions {
  adElements(): HTMLElement[] | undefined;
  title(): string | void;
  price(): number | void;
  upc(): string | void;
  image(): string | void;
  url(): string | void;
  nextPageAvailable(
    document: HTMLElement,
    failureCallback: Function
  ): boolean | void;
  waitForAds(): boolean;
  waitForPagination(): boolean;
  nextPageUrl(
    url: string,
    currentPageNum: number
  ): { nextUrl: string; nextPageNumber: number };
  waitOptions: { timeout: number };
}

class AdElementParser implements ParserInstructions {
  readonly adElement: HTMLElement;

  constructor(adElement: HTMLElement) {
    this.adElement = adElement;
  }
}
