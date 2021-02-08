import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1612815659433 implements MigrationInterface {
    name = 'Initial1612815659433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `url` (`id` int NOT NULL AUTO_INCREMENT, `url` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `storeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `store` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `baseUrl` varchar(255) NOT NULL, `logo` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `url` ADD CONSTRAINT `FK_1414ca3e4c07fbef44884c2df50` FOREIGN KEY (`storeId`) REFERENCES `store`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `url` DROP FOREIGN KEY `FK_1414ca3e4c07fbef44884c2df50`");
        await queryRunner.query("DROP TABLE `store`");
        await queryRunner.query("DROP TABLE `url`");
    }

}
