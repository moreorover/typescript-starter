import {MigrationInterface, QueryRunner} from "typeorm";

export class ItemPrice1613597267223 implements MigrationInterface {
    name = 'ItemPrice1613597267223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `price` (`id` int NOT NULL AUTO_INCREMENT, `price` int NOT NULL, `delta` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `itemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `item` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `upc` varchar(255) NOT NULL, `imageUrl` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `whereFound` varchar(255) NOT NULL, `price` int NOT NULL, `delta` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
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
        await queryRunner.query("DROP TABLE `item`");
        await queryRunner.query("DROP TABLE `price`");
    }

}
