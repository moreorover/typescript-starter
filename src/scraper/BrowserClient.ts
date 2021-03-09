const puppeteer = require("puppeteer");
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { HTMLElement, parse } from "node-html-parser";
import "dotenv-safe/config";

export interface BrowserClient {
  browser: Browser;
  tab: Page;
  start(this: BrowserClient): Promise<void>;
  navigateTo(this: BrowserClient, url: string): Promise<void>;
  openTab(this: BrowserClient): Promise<void>;
  closeTab(this: BrowserClient): Promise<void>;
  closeBrowser(this: BrowserClient): Promise<void>;
  getHtmlContent(this: BrowserClient): Promise<HTMLElement>;
  waitForFunction(
    this: BrowserClient,
    callback: Function,
    options: { timeout: number }
  ): Promise<any>;
}

export class Pup implements BrowserClient {
  browser: Browser;
  tab: Page;

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
      this.browser = await puppeteer.launch({
        headless: process.env.PUPPETEER_BROWSER_HEADLESS,
        slowMo: process.env.PUPPETEER_BROWSER_SLOWMO,
      });
    }
  }

  async closeTab(this: BrowserClient): Promise<void> {
    await this.tab.close();
  }
  async closeBrowser(this: BrowserClient): Promise<void> {
    let pages = await this.browser.pages();
    await Promise.all(pages.map((page) => page.close()));
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
  async waitForFunction(
    this: BrowserClient,
    callback: Function,
    options: { timeout: number }
  ): Promise<any> {
    return await this.tab.waitForFunction(callback, options);
  }
}
