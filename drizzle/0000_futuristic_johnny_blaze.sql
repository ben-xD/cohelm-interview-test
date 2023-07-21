CREATE TABLE `cells` (
	`name` text NOT NULL,
	`doubling_time` real NOT NULL,
	`max_confluence` real
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cells_name_unique` ON `cells` (`name`);