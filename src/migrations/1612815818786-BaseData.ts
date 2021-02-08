import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseData1612815818786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO store VALUES (1, 'Creation Watches', 'https://www.creationwatches.com', 'https://www.complaintsboard.com/img/business/116976/182x300/creation-watches.jpg', '2021-02-08 19:25:42.536840', '2021-02-08 19:25:42.536840');`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (1, 'https://www.creationwatches.com/products/timex-watches-434/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.812606', '2021-02-08 19:25:42.812606', 1);`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (2, 'https://www.creationwatches.com/products/bulova-watches-271/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.934888', '2021-02-08 19:25:42.934888', 1);`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (3, 'https://www.creationwatches.com/products/citizen-74/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.935736', '2021-02-08 19:25:42.935736', 1);`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (4, 'https://www.creationwatches.com/products/orient-watches-252/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.935986', '2021-02-08 19:25:42.935986', 1);`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (5, 'https://www.creationwatches.com/products/seiko-75/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.936739', '2021-02-08 19:25:42.936739', 1);`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (6, 'https://www.creationwatches.com/products/hamilton-watches-250/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.936840', '2021-02-08 19:25:42.936840', 1);`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (7, 'https://www.creationwatches.com/products/tissot-247/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.936918', '2021-02-08 19:25:42.936918', 1);`
    );
    await queryRunner.query(
      `INSERT INTO url VALUES (8, 'https://www.creationwatches.com/products/casio-watches-73/index-1-5d.html?currency=GBP', '2021-02-08 19:25:42.936608', '2021-02-08 19:25:42.936608', 1);`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
