import { Item } from "./../models/Item";
import { Url } from "./../models/Url";

export class DatabaseReader {
  async findByLikeUrl(likeUrl: string): Promise<Url | undefined> {
    const curTime = new Date();
    curTime.setHours(
      curTime.getHours() - Number(process.env.SCRAPING_FREQUENCY_IN_HOURS)
    );
    return await Url.findByLikeUrl(likeUrl, curTime);
  }

  async fetchItemByUpc(upc: string): Promise<Item | undefined> {
    return await Item.findByUpc(upc);
  }
}
