CREATE TABLE `Users` (
    `id` varchar(64) NOT NULL,
    `password` varchar(300) NOT NULL
)

CREATE TABLE `Sessions` (
    `userId` varchar(64) NOT NULL,
    `accessToken` varchar(512) NOT NULL,
    `refreshToken` varchar(512) NOT NULL,
    `expiresIn` timestamp NOT NULL,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE `Files` (
    `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(64) NOT NULL,
    `originalName` varchar(64) NOT NULL,
    `ext` varchar(64) NOT NULL,
    `mimeType` varchar(128) NOT NULL,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)