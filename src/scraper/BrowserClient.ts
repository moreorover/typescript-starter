const puppeteer = require("puppeteer");
import "dotenv-safe/config";
import { Browser } from "puppeteer/lib/cjs/puppeteer/common/Browser";
import { Page } from "puppeteer/lib/cjs/puppeteer/common/Page";
import { parse } from "node-html-parser";
import { HTMLElement } from "node-html-parser";

export interface BrowserClient {
  browser: Browser;
  tab: Page;
  start(): Promise<void>;
  navigateTo(url: string): Promise<void>;
  openTab(): Promise<void>;
  closeTab(): Promise<void>;
  closeBrowser(): Promise<void>;
  getHtmlContent(): Promise<HTMLElement>;
  waitForFunction(
    callback: Function,
    options: { timeout: number }
  ): Promise<any>;
  waitForFunctionBoolean(
    callback: Function,
    options: { timeout: number }
  ): Promise<boolean>;
}

export class Pup implements BrowserClient {
  browser: Browser;
  tab: Page;

  async openTab(): Promise<void> {
    if (!this.browser) {
      await this.start();
    }
    this.tab = await this.browser.newPage();
  }
  async navigateTo(url: string): Promise<void> {
    await this.openTab();
    await this.tab.goto(url, { waitUntil: "networkidle2" });
  }
  async start(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: process.env.PUPPETEER_BROWSER_HEADLESS === "true",
        slowMo: process.env.PUPPETEER_BROWSER_SLOWMO,
      });
    }
  }

  async closeTab(): Promise<void> {
    await this.tab.close();
  }
  async closeBrowser(): Promise<void> {
    let pages = await this.browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await this.browser.close();
  }
  async getHtmlContent(): Promise<HTMLElement> {
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
    callback: Function,
    options: { timeout: number }
  ): Promise<any> {
    return await this.tab.waitForFunction(callback, options);
  }

  async waitForFunctionBoolean(
    callback: Function,
    options: { timeout: number }
  ): Promise<boolean> {
    try {
      await this.tab.waitForFunction(callback, options);
      return true;
    } catch (e) {
      return false;
    }
  }
}
