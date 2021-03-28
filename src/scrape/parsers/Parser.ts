import { HTMLElement } from "node-html-parser";
export class Parser {
  parse(parseFunction: Function, html: HTMLElement): string | number | null {
    try {
      return parseFunction(html);
    } catch {
      console.log("something is wrong");
    }
    return null;
  }
}
