-- CreateTable
CREATE TABLE "Collab" (
    "id" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Collab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Collaborators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collab_roomName_key" ON "Collab"("roomName");

-- CreateIndex
CREATE INDEX "_Collaborators_B_index" ON "_Collaborators"("B");

-- AddForeignKey
ALTER TABLE "Collab" ADD CONSTRAINT "Collab_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Collaborators" ADD CONSTRAINT "_Collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Collab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Collaborators" ADD CONSTRAINT "_Collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
