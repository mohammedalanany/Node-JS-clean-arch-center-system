import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteFullNameuser1775987805503 implements MigrationInterface {
    name = 'DeleteFullNameuser1775987805503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fullName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_7aff205df2c337240c14e6dd3a3\``);
        await queryRunner.query(`DROP INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`centerId\` \`centerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_e63173ac43b478c2fc0cc20ac39\``);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`schedule\` \`schedule\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`teacherId\` \`teacherId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`attendances\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`paidAt\` \`paidAt\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`email\` \`email\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`dateOfBirth\` \`dateOfBirth\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`email\` \`email\` varchar(100) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\` (\`email\`, \`centerId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_7aff205df2c337240c14e6dd3a3\` FOREIGN KEY (\`centerId\`) REFERENCES \`centers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_e63173ac43b478c2fc0cc20ac39\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_e63173ac43b478c2fc0cc20ac39\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_7aff205df2c337240c14e6dd3a3\``);
        await queryRunner.query(`DROP INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`email\` \`email\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`phone\` \`phone\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`dateOfBirth\` \`dateOfBirth\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`email\` \`email\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`phone\` \`phone\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`paidAt\` \`paidAt\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`attendances\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`teacherId\` \`teacherId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`schedule\` \`schedule\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_e63173ac43b478c2fc0cc20ac39\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`centerId\` \`centerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\` (\`email\`, \`centerId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_7aff205df2c337240c14e6dd3a3\` FOREIGN KEY (\`centerId\`) REFERENCES \`centers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`fullName\` varchar(150) NOT NULL`);
    }

}
