import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcademicFieldsToGroupFix1776005390395 implements MigrationInterface {
    name = 'AddAcademicFieldsToGroupFix1776005390395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`groups\` ADD \`stage\` enum ('primary', 'preparatory', 'secondary') NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD \`grade\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD \`track\` enum ('scientific', 'literary', 'general') NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_7aff205df2c337240c14e6dd3a3\``);
        await queryRunner.query(`DROP INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`centerId\` \`centerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_e63173ac43b478c2fc0cc20ac39\``);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP COLUMN \`weeklySchedule\``);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD \`weeklySchedule\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`teacherId\` \`teacherId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`attendances\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`paidAt\` \`paidAt\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`exams\` DROP FOREIGN KEY \`FK_d194afbae15220e5d796a28bc59\``);
        await queryRunner.query(`ALTER TABLE \`exams\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`exams\` CHANGE \`groupId\` \`groupId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`exam_results\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`barcode\` \`barcode\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`parentPhone\` \`parentPhone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`email\` \`email\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`dateOfBirth\` \`dateOfBirth\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`school\` \`school\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`grade\` \`grade\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`photoUrl\` \`photoUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`email\` \`email\` varchar(100) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\` (\`email\`, \`centerId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_7aff205df2c337240c14e6dd3a3\` FOREIGN KEY (\`centerId\`) REFERENCES \`centers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_e63173ac43b478c2fc0cc20ac39\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exams\` ADD CONSTRAINT \`FK_d194afbae15220e5d796a28bc59\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exams\` DROP FOREIGN KEY \`FK_d194afbae15220e5d796a28bc59\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_e63173ac43b478c2fc0cc20ac39\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_7aff205df2c337240c14e6dd3a3\``);
        await queryRunner.query(`DROP INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`email\` \`email\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`phone\` \`phone\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`centers\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`photoUrl\` \`photoUrl\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`grade\` \`grade\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`school\` \`school\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`dateOfBirth\` \`dateOfBirth\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`email\` \`email\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`parentPhone\` \`parentPhone\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`phone\` \`phone\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`students\` CHANGE \`barcode\` \`barcode\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`exam_results\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`exams\` CHANGE \`groupId\` \`groupId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`exams\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`exams\` ADD CONSTRAINT \`FK_d194afbae15220e5d796a28bc59\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`paidAt\` \`paidAt\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`attendances\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`teacherId\` \`teacherId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP COLUMN \`weeklySchedule\``);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD \`weeklySchedule\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groups\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_e63173ac43b478c2fc0cc20ac39\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`centerId\` \`centerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b07ef753327f6dd3b3dae4332c\` ON \`users\` (\`email\`, \`centerId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_7aff205df2c337240c14e6dd3a3\` FOREIGN KEY (\`centerId\`) REFERENCES \`centers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP COLUMN \`track\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP COLUMN \`grade\``);
        await queryRunner.query(`ALTER TABLE \`groups\` DROP COLUMN \`stage\``);
    }

}
