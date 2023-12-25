-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "enemy" TEXT,
    "host" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
