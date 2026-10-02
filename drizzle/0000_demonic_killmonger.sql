CREATE TABLE `movements` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`type` text NOT NULL,
	`cents` integer NOT NULL,
	`category` text NOT NULL,
	`note` text NOT NULL,
	`date` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `movements_owner_date` ON `movements` (`owner`,`date`);