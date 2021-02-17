const puppeteer = require("puppeteer");
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { HTMLElement, parse } from "node-html-parser";

export interface BrowserClient {
  browser: Browser;
  tab: Page;
  settings: object;
  start(this: BrowserClient): Promise<void>;
  navigateTo(this: BrowserClient, url: string): Promise<void>;
  openTab(this: BrowserClient): Promise<void>;
  closeTab(this: BrowserClient): Promise<void>;
  closeBrowser(this: BrowserClient): Promise<void>;
  getHtmlContent(this: BrowserClient): Promise<HTMLElement>;
  waitForFunction(this: BrowserClient, callback: Function): Promise<any>;
}

export class Pup implements BrowserClient {
  browser: Browser;
  tab: Page;
  settings: object;

  constructor(settings: object) {
    this.settings = settings;
  }
  async openTab(this: BrowserClient): Promise<void> {
    if (!this.browser) {
      await this.start();
    }
    this.tab = await this.browser.newPage();
  }
  async navigateTo(this: BrowserClient, url: string): Promise<void> {
    await this.tab.goto(url, { waitUntil: "networkidle2" });
  }
  async start(this: BrowserClient): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.settings);
    }
  }

  async closeTab(this: BrowserClient): Promise<void> {
    await this.tab.close();
  }
  async closeBrowser(this: BrowserClient): Promise<void> {
    await this.browser.close();
  }
  async getHtmlContent(this: BrowserClient): Promise<HTMLElement> {
    return parse(await this.tab.content(), {
      lowerCaseTagName: false, // convert tag name to lower case (hurt performance heavily)
      comment: false, // retrieve comments (hurt performance slightly)
      blockTextElements: {
        script: true, // keep text content when parsing
        noscript: true, // keep text content when parsing
        style: true, // keep text content when parsing
        pre: true, // keep text content when parsing
      },
    });
  }
  async waitForFunction(this: BrowserClient, callback: Function): Promise<any> {
    return await this.tab.waitForFunction(callback);
  }
}
