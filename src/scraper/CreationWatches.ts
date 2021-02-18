import { HTMLElement } from "node-html-parser";
import { ParserInstructions } from "./types";
import validator from "validator";

export const creationWatchesInstructions: ParserInstructions = {
  adElements: (
    document: HTMLElement,
    failureCallback: Function
  ): HTMLElement[] | void => {
    try {
      let adElements: HTMLElement[] = document.querySelectorAll(
        "div.product-box"
      );
      if (adElements.length < 1) {
        throw new Error("Array of ads is empty.");
      }
      return adElements;
    } catch {
      failureCallback();
    }
  },
  title: (adElement: HTMLElement, failureCallback: Function): string | void => {
    try {
      let title: string = adElement.querySelector("h3.product-name a")
        .textContent;
      if (validator.isEmpty(title)) {
        throw new Error("String is empty.");
      }
      return title;
    } catch {
      failureCallback();
    }
  },
  price: (adElement: HTMLElement, failureCallback: Function): number | void => {
    try {
      let price: number = Number(
        adElement
          .querySelector("p.product-price span")
          .textContent.replace(/[^\d\.\-]/g, "")
      );
      if (!(price > 0)) {
        throw new Error("Invalid price");
      }
      return price;
    } catch {
      failureCallback();
    }
  },
  upc: (adElement: HTMLElement, failureCallback: Function): string | void => {
    try {
      let upc: string =
        "CW_" +
        adElement
          .querySelector("p.product-model-no")
          .textContent.split(": ")[1];
      if (validator.isEmpty(upc)) {
        throw new Error("String is empty.");
      }
      return upc;
    } catch {
      failureCallback();
    }
  },
  image: (adElement: HTMLElement, failureCallback: Function): string | void => {
    try {
      let img: string = adElement
        .querySelector("img.product-image")
        .getAttribute("src");
      if (validator.isEmpty(img)) {
        throw new Error("String is empty.");
      }
      return img;
    } catch {
      failureCallback();
    }
  },
  url: (adElement: HTMLElement, failureCallback: Function): string | void => {
    try {
      let url: string = adElement
        .querySelector("h3.product-name a")
        .getAttribute("href");
      if (validator.isEmpty(url)) {
        throw new Error("String is empty.");
      }
      return url;
    } catch {
      failureCallback();
    }
  },
  nextPageAvailable: (
    document: HTMLElement,
    failureCallback: Function
  ): boolean | void => {
    try {
      let pagination: string = document.querySelector(
        "div.display-heading-box p"
      ).textContent;

      if (validator.isEmpty(pagination)) {
        throw new Error("Pagination is empty");
      }
      let paginationNumbers: number[] = pagination
        .split(" ")
        .filter((e) => +e)
        .map(Number);

      if (paginationNumbers[1] !== paginationNumbers[2]) {
        return true;
      }
      return false;
    } catch {
      failureCallback();
    }
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
