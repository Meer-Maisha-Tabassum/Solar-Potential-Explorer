-- CreateTable
CREATE TABLE "FinancialModel" (
    "id" SERIAL NOT NULL,
    "modelType" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialModel_modelType_key" ON "FinancialModel"("modelType");
