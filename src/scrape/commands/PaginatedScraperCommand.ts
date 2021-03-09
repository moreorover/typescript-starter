class PaginatedScraperCommand implements Command {
  currentPageUrl: string;
  currentPageNumber: number;

  constructor(currentPageUrl: string, currentPageNumber: number) {
    this.currentPageUrl = currentPageUrl;
    this.currentPageNumber = currentPageNumber;
  }

  execute() {
    return undefined;
  }
}
