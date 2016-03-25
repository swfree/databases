CREATE DATABASE chat;

USE chat;

DROP TABLE IF EXISTS `Messages`;
    
CREATE TABLE `Messages` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `room_id` INTEGER NULL DEFAULT NULL,
  `user_id` INTEGER NULL,
  `text` VARCHAR(144) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Users'
-- 
-- ---

DROP TABLE IF EXISTS `Users`;
    
CREATE TABLE `Users` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `name` VARCHAR(20) NULL DEFAULT 'anonymous',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Rooms'
-- 
-- ---

DROP TABLE IF EXISTS `Rooms`;
    
CREATE TABLE `Rooms` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `roomname` VARCHAR(20) NULL DEFAULT 'lobby',
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `Messages` ADD FOREIGN KEY (room_id) REFERENCES `Rooms` (`id`);
ALTER TABLE `Messages` ADD FOREIGN KEY (user_id) REFERENCES `Users` (`id`);


/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

