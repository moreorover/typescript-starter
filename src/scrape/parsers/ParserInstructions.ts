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
