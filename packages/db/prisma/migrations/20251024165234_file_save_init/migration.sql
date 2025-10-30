-- CreateTable
CREATE TABLE "FileSave" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dev_count" INTEGER NOT NULL DEFAULT 1,
    "collab" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "FileSave_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileSave" ADD CONSTRAINT "FileSave_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
