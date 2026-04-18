import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentAndExamsV21776000484897 implements MigrationInterface {
    name = 'UpdateStudentAndExamsV21776000484897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`exam_results\` (\`id\` int NOT NULL AUTO_INCREMENT, \`attainedMarks\` decimal(5,2) NOT NULL, \`notes\` text NULL, \`studentId\` int NOT NULL, \`examId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_7ef2a5e17cf50726d548405acf\` (\`examId\`), INDEX \`IDX_033e5c68fb99745a58e82f7abd\` (\`studentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exams\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(150) NOT NULL, \`totalMarks\` decimal(5,2) NOT NULL, \`date\` date NOT NULL, \`notes\` text NULL, \`centerId\` int NOT NULL, \`groupId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_21de68df9dd2d2472337519228\` (\`centerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`barcode\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD UNIQUE INDEX \`IDX_4ce6fec6bdd380d580a74c91fc\` (\`barcode\`)`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`parentPhone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`school\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`academicYear\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`track\` enum ('scientific', 'literary', 'general') NOT NULL DEFAULT 'general'`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`photoUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`status\` enum ('active', 'suspended', 'graduated') NOT NULL DEFAULT 'active'`);
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
        await queryRunner.query(`ALTER TABLE \`exam_results\` ADD CONSTRAINT \`FK_033e5c68fb99745a58e82f7abdf\` FOREIGN KEY (\`studentId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exam_results\` ADD CONSTRAINT \`FK_7ef2a5e17cf50726d548405acfe\` FOREIGN KEY (\`examId\`) REFERENCES \`exams\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exams\` ADD CONSTRAINT \`FK_21de68df9dd2d2472337519228f\` FOREIGN KEY (\`centerId\`) REFERENCES \`centers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exams\` ADD CONSTRAINT \`FK_d194afbae15220e5d796a28bc59\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exams\` DROP FOREIGN KEY \`FK_d194afbae15220e5d796a28bc59\``);
        await queryRunner.query(`ALTER TABLE \`exams\` DROP FOREIGN KEY \`FK_21de68df9dd2d2472337519228f\``);
        await queryRunner.query(`ALTER TABLE \`exam_results\` DROP FOREIGN KEY \`FK_7ef2a5e17cf50726d548405acfe\``);
        await queryRunner.query(`ALTER TABLE \`exam_results\` DROP FOREIGN KEY \`FK_033e5c68fb99745a58e82f7abdf\``);
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
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`photoUrl\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`track\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`academicYear\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`school\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`parentPhone\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP INDEX \`IDX_4ce6fec6bdd380d580a74c91fc\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`barcode\``);
        await queryRunner.query(`DROP INDEX \`IDX_21de68df9dd2d2472337519228\` ON \`exams\``);
        await queryRunner.query(`DROP TABLE \`exams\``);
        await queryRunner.query(`DROP INDEX \`IDX_033e5c68fb99745a58e82f7abd\` ON \`exam_results\``);
        await queryRunner.query(`DROP INDEX \`IDX_7ef2a5e17cf50726d548405acf\` ON \`exam_results\``);
        await queryRunner.query(`DROP TABLE \`exam_results\``);
    }

}
