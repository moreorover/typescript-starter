import "reflect-metadata";
import "dotenv-safe/config";

import { Store } from "./models/Store";
import { Url } from "./models/Url";
import { Price } from "./models/Price";
import { Item } from "./models/Item";
import { createConnection } from "typeorm";
import path = require("path");
import { mainScraper } from "./scraper/main";
import { Client } from "discord.js";
const Discord = require("discord.js");
import { setIntervalAsync } from "set-interval-async/fixed";

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

  const client: Client = new Discord.Client();

  client.once("ready", () => {
    console.log("Discord Bot ready!");
  });

  // const channel = client.channels.cache.get('<id>');
  // channel.send('<content>');

  await client.login(process.env.DISCORD_BOT_TOKEN);
  // setInterval(mainScraper, 1000 * 60, client);
  // setInterval(mainScraper, 1000);
  // creationWatches();
  // mainScraper();
  setIntervalAsync(mainScraper, 1000 * 60, client);
};

main();
