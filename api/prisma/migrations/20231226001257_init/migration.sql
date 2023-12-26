-- CreateEnum
CREATE TYPE "ROOM_STATUS" AS ENUM ('FIND', 'ACTIVE', 'FINISH', 'DELETED');

-- CreateEnum
CREATE TYPE "GAME_STATUS" AS ENUM ('ACTIVE', 'FINISH');

-- CreateTable
CREATE TABLE "AccessKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessKeyId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ROOM_STATUS" NOT NULL DEFAULT 'FIND',
    "hostId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "roomId" INTEGER NOT NULL,
    "status" "GAME_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "_Rooms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_accessKeyId_key" ON "User"("accessKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "_Rooms_AB_unique" ON "_Rooms"("A", "B");

-- CreateIndex
CREATE INDEX "_Rooms_B_index" ON "_Rooms"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "AccessKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Rooms" ADD CONSTRAINT "_Rooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Rooms" ADD CONSTRAINT "_Rooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
