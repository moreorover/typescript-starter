import { Url } from "./../models/Url";

export class DatabaseReader {
  async findByLikeUrl(
    likeUrl: string,
    lastTimeUpdated: Date
  ): Promise<Url | undefined> {
    return await Url.findByLikeUrl("creationwatches", lastTimeUpdated);
  }
}
