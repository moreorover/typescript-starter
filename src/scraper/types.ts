import { HTMLElement } from "node-html-parser";

export interface ItemAd {
  title: string;
  price: number;
  upc: string;
  image: string;
  itemUrl: string;
  whereFound: string;
}

export class ParsedItemAd implements ItemAd {
  title: string;
  price: number;
  upc: string;
  image: string;
  itemUrl: string;
  whereFound: string;
  constructor() {}
}

export interface ParserInstructions {
  adElements(
    document: HTMLElement,
    failureCallback: Function
  ): HTMLElement[] | void;
  title(adElement: HTMLElement, failureCallback: Function): string | void;
  price(adElement: HTMLElement, failureCallback: Function): number | void;
  upc(adElement: HTMLElement, failureCallback: Function): string | void;
  image(adElement: HTMLElement, failureCallback: Function): string | void;
  url(adElement: HTMLElement, failureCallback: Function): string | void;
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
}
