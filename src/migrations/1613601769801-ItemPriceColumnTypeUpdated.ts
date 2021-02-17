import {MigrationInterface, QueryRunner} from "typeorm";

export class ItemPriceColumnTypeUpdated1613601769801 implements MigrationInterface {
    name = 'ItemPriceColumnTypeUpdated1613601769801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `price` DROP FOREIGN KEY `FK_7d2d28622a23f2ad970f11bed98`");
        await queryRunner.query("ALTER TABLE `price` DROP COLUMN `price`");
        await queryRunner.query("ALTER TABLE `price` ADD `price` double NOT NULL");
        await queryRunner.query("ALTER TABLE `price` DROP COLUMN `delta`");
        await queryRunner.query("ALTER TABLE `price` ADD `delta` double NOT NULL");
        await queryRunner.query("ALTER TABLE `price` CHANGE `itemId` `itemId` int NULL");
        await queryRunner.query("ALTER TABLE `item` DROP COLUMN `price`");
        await queryRunner.query("ALTER TABLE `item` ADD `price` double NOT NULL");
        await queryRunner.query("ALTER TABLE `item` DROP COLUMN `delta`");
        await queryRunner.query("ALTER TABLE `item` ADD `delta` double NOT NULL");
        await queryRunner.query("ALTER TABLE `url` DROP FOREIGN KEY `FK_1414ca3e4c07fbef44884c2df50`");
        await queryRunner.query("ALTER TABLE `url` CHANGE `storeId` `storeId` int NULL");
        await queryRunner.query("ALTER TABLE `price` ADD CONSTRAINT `FK_7d2d28622a23f2ad970f11bed98` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `url` ADD CONSTRAINT `FK_1414ca3e4c07fbef44884c2df50` FOREIGN KEY (`storeId`) REFERENCES `store`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `url` DROP FOREIGN KEY `FK_1414ca3e4c07fbef44884c2df50`");
        await queryRunner.query("ALTER TABLE `price` DROP FOREIGN KEY `FK_7d2d28622a23f2ad970f11bed98`");
        await queryRunner.query("ALTER TABLE `url` CHANGE `storeId` `storeId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `url` ADD CONSTRAINT `FK_1414ca3e4c07fbef44884c2df50` FOREIGN KEY (`storeId`) REFERENCES `store`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` DROP COLUMN `delta`");
        await queryRunner.query("ALTER TABLE `item` ADD `delta` int NOT NULL");
        await queryRunner.query("ALTER TABLE `item` DROP COLUMN `price`");
        await queryRunner.query("ALTER TABLE `item` ADD `price` int NOT NULL");
        await queryRunner.query("ALTER TABLE `price` CHANGE `itemId` `itemId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `price` DROP COLUMN `delta`");
        await queryRunner.query("ALTER TABLE `price` ADD `delta` int NOT NULL");
        await queryRunner.query("ALTER TABLE `price` DROP COLUMN `price`");
        await queryRunner.query("ALTER TABLE `price` ADD `price` int NOT NULL");
        await queryRunner.query("ALTER TABLE `price` ADD CONSTRAINT `FK_7d2d28622a23f2ad970f11bed98` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
