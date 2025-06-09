-- CreateTable
CREATE TABLE "Modificador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem_url" TEXT NOT NULL,
    "efeito" JSONB NOT NULL,

    CONSTRAINT "Modificador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "dinheiro" INTEGER NOT NULL,
    "modificadores_equipados" INTEGER[],
    "ante_atual" INTEGER NOT NULL,
    "meta_pontos" INTEGER NOT NULL,
    "maos_por_ante" INTEGER NOT NULL,
    "maos_restantes" INTEGER NOT NULL,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Modificador_nome_key" ON "Modificador"("nome");
