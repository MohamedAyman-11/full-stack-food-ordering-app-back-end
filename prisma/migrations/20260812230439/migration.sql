-- CreateTable
CREATE TABLE "CategorySize" (
    "category_id" TEXT NOT NULL,
    "size_id" TEXT NOT NULL,

    CONSTRAINT "CategorySize_pkey" PRIMARY KEY ("category_id","size_id")
);

-- CreateTable
CREATE TABLE "CategoryExtras" (
    "category_id" TEXT NOT NULL,
    "extra_id" TEXT NOT NULL,

    CONSTRAINT "CategoryExtras_pkey" PRIMARY KEY ("extra_id","category_id")
);

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtras" ADD CONSTRAINT "CategoryExtras_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtras" ADD CONSTRAINT "CategoryExtras_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
