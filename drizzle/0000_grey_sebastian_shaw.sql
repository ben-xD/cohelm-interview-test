CREATE TABLE `cells` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`doubling_time` real NOT NULL,
	`max_confluence` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cells_name_unique` ON `cells` (`name`);