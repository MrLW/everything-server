-- CreateTable
CREATE TABLE `et_event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('marry', 'love', 'birthday', 'menses') NOT NULL DEFAULT 'marry',
    `bf` VARCHAR(4) NULL,
    `gf` VARCHAR(4) NULL,
    `husband` VARCHAR(4) NULL,
    `wife` VARCHAR(4) NULL,
    `startTime` VARCHAR(16) NOT NULL,
    `username` VARCHAR(4) NULL,
    `remark` VARCHAR(20) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL DEFAULT 1,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastUpdate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_day_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('menses', 'love', 'marry', 'birthday', 'deathday') NOT NULL DEFAULT 'menses',
    `className` VARCHAR(64) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `index` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_day_love_moment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(64) NOT NULL,
    `content` TEXT NOT NULL,
    `loves` INTEGER NOT NULL DEFAULT 0,
    `stars` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL DEFAULT 1,
    `images` TEXT NOT NULL,
    `public` BOOLEAN NOT NULL DEFAULT false,
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `et_publisher`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_day_love_moment_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `momentId` INTEGER NOT NULL,
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `momentId`(`momentId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eid` VARCHAR(32) NOT NULL DEFAULT '',
    `email` VARCHAR(64) NOT NULL DEFAULT '',
    `username` VARCHAR(16) NOT NULL DEFAULT '',
    `avatarUrl` VARCHAR(256) NOT NULL DEFAULT '',
    `sex` INTEGER NOT NULL DEFAULT 0,
    `openid` VARCHAR(64) NOT NULL DEFAULT '',
    `country` VARCHAR(16) NOT NULL DEFAULT '',
    `province` VARCHAR(16) NOT NULL DEFAULT '',
    `city` VARCHAR(16) NOT NULL DEFAULT '',
    `district` VARCHAR(16) NOT NULL DEFAULT '',
    `exps` INTEGER NOT NULL DEFAULT 0,
    `loves` INTEGER NOT NULL DEFAULT 0,
    `subs` INTEGER NOT NULL DEFAULT 0,
    `collects` INTEGER NOT NULL DEFAULT 0,
    `birthday` VARCHAR(16) NOT NULL DEFAULT '',
    `desc` VARCHAR(512) NOT NULL DEFAULT '',
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `eid`(`eid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `CITY_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `CITY_CODE` VARCHAR(40) NOT NULL,
    `CITY_NAME` VARCHAR(40) NOT NULL,
    `SHORT_NAME` VARCHAR(20) NOT NULL,
    `PROVINCE_CODE` VARCHAR(40) NULL,
    `LNG` VARCHAR(20) NULL,
    `LAT` VARCHAR(20) NULL,
    `SORT` INTEGER NULL,
    `GMT_CREATE` DATETIME(0) NULL,
    `GMT_MODIFIED` DATETIME(0) NULL,
    `MEMO` VARCHAR(250) NULL,
    `DATA_STATE` INTEGER NULL,
    `TENANT_CODE` VARCHAR(32) NULL,

    INDEX `Index_1`(`CITY_CODE`, `TENANT_CODE`),
    PRIMARY KEY (`CITY_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `district` (
    `AREA_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `AREA_CODE` VARCHAR(40) NOT NULL,
    `CITY_CODE` VARCHAR(40) NULL,
    `AREA_NAME` VARCHAR(40) NOT NULL,
    `SHORT_NAME` VARCHAR(20) NOT NULL,
    `LNG` VARCHAR(20) NULL,
    `LAT` VARCHAR(20) NULL,
    `SORT` INTEGER NULL,
    `GMT_CREATE` DATETIME(0) NULL,
    `GMT_MODIFIED` DATETIME(0) NULL,
    `MEMO` VARCHAR(250) NULL,
    `DATA_STATE` INTEGER NULL,
    `TENANT_CODE` VARCHAR(32) NULL,

    INDEX `Index_1`(`AREA_CODE`, `TENANT_CODE`),
    PRIMARY KEY (`AREA_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `province` (
    `PROVINCE_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `PROVINCE_CODE` VARCHAR(40) NOT NULL,
    `PROVINCE_NAME` VARCHAR(50) NOT NULL,
    `SHORT_NAME` VARCHAR(20) NOT NULL,
    `LNG` VARCHAR(20) NULL,
    `LAT` VARCHAR(20) NULL,
    `SORT` INTEGER NULL,
    `GMT_CREATE` DATETIME(0) NULL,
    `GMT_MODIFIED` DATETIME(0) NULL,
    `MEMO` VARCHAR(250) NULL,
    `DATA_STATE` INTEGER NULL,
    `TENANT_CODE` VARCHAR(32) NULL,

    INDEX `Index_1`(`PROVINCE_CODE`, `TENANT_CODE`),
    PRIMARY KEY (`PROVINCE_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sendId` INTEGER NOT NULL,
    `receId` INTEGER NOT NULL,
    `content` VARCHAR(128) NOT NULL DEFAULT '',
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `receId`(`receId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_user_relation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sendId` INTEGER NOT NULL,
    `receId` INTEGER NOT NULL,
    `type` ENUM('friend', 'love', 'marry') NOT NULL DEFAULT 'friend',
    `status` ENUM('apply', 'success') NULL DEFAULT 'apply',
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `et_receer`(`receId`),
    INDEX `et_sender`(`sendId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(64) NOT NULL DEFAULT '',
    `content` VARCHAR(256) NOT NULL DEFAULT '',
    `userId` INTEGER NOT NULL,
    `data` TEXT NOT NULL,
    `status` ENUM('unread', 'read', 'complete') NOT NULL DEFAULT 'read',
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `et_user`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_day_love_moment_mapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `momentId` INTEGER NOT NULL,
    `type` ENUM('love', 'star') NOT NULL DEFAULT 'love',
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `moment`(`momentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `et_todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(64) NOT NULL,
    `content` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `duration` INTEGER NOT NULL,
    `startTime` TIMESTAMP(0) NOT NULL DEFAULT '0000-00-00 00:00:00',
    `createTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lastModifiedTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `et_day_love_moment` ADD CONSTRAINT `et_publisher` FOREIGN KEY (`userId`) REFERENCES `et_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `et_day_love_moment_comment` ADD CONSTRAINT `momentId` FOREIGN KEY (`momentId`) REFERENCES `et_day_love_moment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `et_day_love_moment_comment` ADD CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `et_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `et_chat` ADD CONSTRAINT `recvId` FOREIGN KEY (`receId`) REFERENCES `et_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `et_user_relation` ADD CONSTRAINT `et_receer` FOREIGN KEY (`receId`) REFERENCES `et_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `et_user_relation` ADD CONSTRAINT `et_sender` FOREIGN KEY (`sendId`) REFERENCES `et_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `et_message` ADD CONSTRAINT `et_user` FOREIGN KEY (`userId`) REFERENCES `et_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `et_day_love_moment_mapping` ADD CONSTRAINT `moment` FOREIGN KEY (`momentId`) REFERENCES `et_day_love_moment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
