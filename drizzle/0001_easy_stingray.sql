CREATE TABLE `categories` (
	`owner` text NOT NULL,
	`type` text NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`created` text NOT NULL,
	PRIMARY KEY(`owner`, `type`, `key`)
);
