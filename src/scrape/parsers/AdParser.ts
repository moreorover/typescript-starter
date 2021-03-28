import { Parser } from "./Parser";
import { HTMLElement } from "node-html-parser";
export abstract class AdParser extends Parser {
  parseTitle(htmlElement: HTMLElement): string | null {
    return null;
  }
  parsePrice(htmlElement: HTMLElement): number | null {
    return null;
  }
  parseUpc(htmlElement: HTMLElement): string | null {
    return null;
  }
  parseUrl(htmlElement: HTMLElement): string | null {
    return null;
  }
  parseImage(htmlElement: HTMLElement): string | null {
    super.parse(() => {
      console.log(htmlElement);
    }, htmlElement);
    return null;
  }
}
