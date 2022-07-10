/*
  Warnings:

  - Added the required column `room` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chatroom` ADD COLUMN `room` VARCHAR(150) NOT NULL;
