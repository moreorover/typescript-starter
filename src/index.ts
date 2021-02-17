import "reflect-metadata";
import "dotenv-safe/config";

import { Store } from "./models/Store";
import { Url } from "./models/Url";
import { Price } from "./models/Price";
import { Item } from "./models/Item";
import { createConnection } from "typeorm";
import path = require("path");
import { mainScraper } from "./scraper/main";

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

  setInterval(mainScraper, 1000 * 60);
  // setInterval(mainScraper, 1000);
  // creationWatches();
  // mainScraper();
};

main();
