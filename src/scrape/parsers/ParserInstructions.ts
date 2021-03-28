import { HTMLElement } from "node-html-parser";

export type ParserInstructions = {
  adElements(document: HTMLElement): HTMLElement[];
  title(adElement: HTMLElement): string;
  price(adElement: HTMLElement): number;
  upc(adElement: HTMLElement): string;
  image(adElement: HTMLElement): string;
  url(adElement: HTMLElement): string;
  nextPageAvailable(document: HTMLElement): boolean;
  waitForAds(): boolean;
  waitForPagination(): boolean;
  nextPageUrl(
    url: string,
    currentPageNum: number
  ): { nextUrl: string; nextPageNumber: number };
  waitOptions: { timeout: number };
};

export const CWInstructions: ParserInstructions = {
  adElements: (document: HTMLElement): HTMLElement[] => {
    let adElements: HTMLElement[] = document.querySelectorAll(
      "div.product-box"
    );
    return adElements;
  },
  title: (adElement: HTMLElement): string => {
    let title: string = adElement.querySelector("h3.product-name a")
      .textContent;
    return title;
  },
  price: (adElement: HTMLElement): number => {
    let price: number = Number(
      adElement
        .querySelector("p.product-pricex span")
        .textContent.replace(/[^\d\.\-]/g, "")
    );
    if (!(price > 0)) {
      throw new Error("Invalid price");
    }
    return price;
  },
  upc: (adElement: HTMLElement): string => {
    let upc: string =
      "CW_" +
      adElement.querySelector("p.product-model-no").textContent.split(": ")[1];
    return upc;
  },
  image: (adElement: HTMLElement): string => {
    let img: string = adElement
      .querySelector("img.product-image")
      .getAttribute("src");
    return img;
  },
  url: (adElement: HTMLElement): string => {
    let url: string = adElement
      .querySelector("h3.product-name a")
      .getAttribute("href");
    return url;
  },
  nextPageAvailable: (document: HTMLElement): boolean => {
    let pagination: string = document.querySelector("div.display-heading-box p")
      .textContent;
    let paginationNumbers: number[] = pagination
      .split(" ")
      .filter((e) => +e)
      .map(Number);

    if (paginationNumbers[1] !== paginationNumbers[2]) {
      return true;
    }
    return false;
  },
  waitForAds: () => document.querySelectorAll("div.product-box").length > 0,
  waitForPagination: () =>
    document.querySelectorAll("div.display-heading-box p").length > 0,
  nextPageUrl: (
    url: string,
    currentPageNum: number
  ): { nextUrl: string; nextPageNumber: number } => {
    let urlSplit = url.split("/index-");
    return {
      nextUrl:
        urlSplit[0] + "/index-" + ++currentPageNum + "-5d.html?currency=GBP",
      nextPageNumber: currentPageNum,
    };
  },
  waitOptions: { timeout: 1000 * 10 },
};
