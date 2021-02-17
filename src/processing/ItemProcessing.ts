import { Item } from "./../models/Item";
import { Price } from "./../models/Price";
import { ItemAd } from "./../scraper/types";

export async function processItemAd(itemAd: ItemAd) {
  const item = await Item.findByUpc(itemAd.upc);

  if (item) {
    // IF item prices do not mach update item price and delta, save new price
    if (item.price !== itemAd.price) {
      // IF db price < found price baaaad
      if (item.price < itemAd.price) {
        //calculate delta
        // db - 44
        // found 67
        //
        item.delta = +((itemAd.price / item.price - 1) * 100).toFixed(2);
        item.price = itemAd.price;
        item.save();

        let price: Price = new Price();
        price.price = itemAd.price;
        price.delta = item.delta;
        price.item = item;
        price.save();
      }

      // IF db price > found price gooood
      if (item.price > itemAd.price) {
        //calculate delta
        // db - 67
        // found 44
        //
        item.delta = +(-1 * (100 - (itemAd.price / item.price) * 100)).toFixed(
          2
        );
        item.price = itemAd.price;
        item.save();

        let price: Price = new Price();
        price.price = itemAd.price;
        price.delta = item.delta;
        price.item = item;
        price.save();
      }
    }
    // IF item details do not match update item details
  } else {
    // Item with upc was not found in database so we are saving item and price.
    let item: Item = new Item();
    item.title = itemAd.title;
    item.upc = itemAd.upc;
    item.imageUrl = itemAd.image;
    item.url = itemAd.itemUrl;
    item.whereFound = itemAd.whereFound;
    item.price = itemAd.price;
    item.delta = 0;
    await item.save();

    let price: Price = new Price();
    price.price = itemAd.price;
    price.delta = 0;
    price.item = item;
    price.save();
  }
}
