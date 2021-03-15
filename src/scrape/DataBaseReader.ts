import { Item } from "src/models/Item";
import { Url } from "./../models/Url";

export class DatabaseReader {
  async findByLikeUrl(
    likeUrl: string,
    lastTimeUpdated: Date
  ): Promise<Url | undefined> {
    return await Url.findByLikeUrl(likeUrl, lastTimeUpdated);
  }

  async fetchItemByUpc(upc: string): Promise<Item | undefined> {
    return await Item.findByUpc(upc);
  }
}
