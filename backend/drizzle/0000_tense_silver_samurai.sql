CREATE TABLE `medical_records` (
	`id` text NOT NULL,
	`patient_id` text NOT NULL,
	`original_filename` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `utilization_review` (
	`id` text NOT NULL,
	`created_at` integer NOT NULL,
	`patient_id` text NOT NULL,
	`guidelines` text NOT NULL,
	`output` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medical_records_id_unique` ON `medical_records` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `utilization_review_id_unique` ON `utilization_review` (`id`);