import { DiscordBot } from "./scrape/DiscordBot";
import { CWInstructions } from "./scrape/parsers/ParserInstructions";
import { Spider } from "./scrape/parsers/Spider";
import "reflect-metadata";
import "dotenv-safe/config";

import { Store } from "./models/Store";
import { Url } from "./models/Url";
import { Price } from "./models/Price";
import { Item } from "./models/Item";
import { createConnection } from "typeorm";
import path = require("path");
import { DatabaseReader } from "./scrape/DataBaseReader";

const main = async () => {
  const typeOrm = await createConnection({
    type: "mariadb",
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    logging: false,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Store, Url, Item, Price],
  });
  await typeOrm.runMigrations();

  if (typeOrm.isConnected) {
    console.log("Database connection established.");
  }

  const client: DiscordBot = new DiscordBot();
  await client.logIn();

  // const channel = client.channels.cache.get('<id>');
  // channel.send('<content>');

  let CW_spider: Spider = new Spider(
    "creationwatches",
    new DatabaseReader(),
    CWInstructions,
    client
  );

  CW_spider.start();
  // setInterval(mainScraper, 1000 * 60, client);
  // setInterval(mainScraper, 1000);
  // creationWatches();
  // mainScraper();
  // setIntervalAsync(mainScraper, 1000 * 60, client);
};

main();
