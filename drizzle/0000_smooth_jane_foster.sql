CREATE TABLE `admin_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `bets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`member_id` int NOT NULL,
	`lottery_type_id` int NOT NULL,
	`yee_kee_round_id` int,
	`bet_number` varchar(10) NOT NULL,
	`bet_amount` int NOT NULL,
	`rate_type` varchar(64) NOT NULL,
	`multiplier` int NOT NULL DEFAULT 1,
	`status` enum('pending','won','lost','cancelled') NOT NULL DEFAULT 'pending',
	`win_amount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `closed_numbers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lottery_type_id` int NOT NULL,
	`number` varchar(10) NOT NULL,
	`type` enum('closed','half-pay') NOT NULL DEFAULT 'closed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `closed_numbers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lottery_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`code` varchar(20) NOT NULL,
	`icon` varchar(10),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lottery_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `lottery_types_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`username` varchar(64) NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`credit` int NOT NULL DEFAULT 0,
	`status` enum('active','suspended','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `members_id` PRIMARY KEY(`id`),
	CONSTRAINT `members_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `payout_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lottery_type_id` int NOT NULL,
	`rate_type` varchar(64) NOT NULL,
	`rate` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payout_rates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`member_id` int NOT NULL,
	`type` enum('deposit','withdrawal','win','loss','adjustment') NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`related_bet_id` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `yee_kee_rounds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`round_number` int NOT NULL,
	`draw_time` timestamp NOT NULL,
	`result` varchar(5),
	`total_bets` int NOT NULL DEFAULT 0,
	`target_profit_percentage` int NOT NULL DEFAULT 50,
	`target_profit` int NOT NULL DEFAULT 0,
	`actual_profit` int NOT NULL DEFAULT 0,
	`status` enum('pending','active','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `yee_kee_rounds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bets` ADD CONSTRAINT `bets_member_id_users_id_fk` FOREIGN KEY (`member_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bets` ADD CONSTRAINT `bets_lottery_type_id_lottery_types_id_fk` FOREIGN KEY (`lottery_type_id`) REFERENCES `lottery_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bets` ADD CONSTRAINT `bets_yee_kee_round_id_yee_kee_rounds_id_fk` FOREIGN KEY (`yee_kee_round_id`) REFERENCES `yee_kee_rounds`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `closed_numbers` ADD CONSTRAINT `closed_numbers_lottery_type_id_lottery_types_id_fk` FOREIGN KEY (`lottery_type_id`) REFERENCES `lottery_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `members` ADD CONSTRAINT `members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payout_rates` ADD CONSTRAINT `payout_rates_lottery_type_id_lottery_types_id_fk` FOREIGN KEY (`lottery_type_id`) REFERENCES `lottery_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_member_id_members_id_fk` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_related_bet_id_bets_id_fk` FOREIGN KEY (`related_bet_id`) REFERENCES `bets`(`id`) ON DELETE no action ON UPDATE no action;