import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePedidosTables1737829501000 implements MigrationInterface {
    name = 'CreatePedidosTables1737829501000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."pedidos_estado_enum" AS ENUM(
                'pendiente', 
                'confirmado', 
                'en_preparacion', 
                'listo', 
                'entregado', 
                'cancelado'
            )
        `);
        
        await queryRunner.query(`
            CREATE TABLE "pedidos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "total" numeric(10,2) NOT NULL,
                "estado" "public"."pedidos_estado_enum" NOT NULL DEFAULT 'pendiente',
                "notas" text,
                "usuarioId" uuid NOT NULL,
                "fechaCreacion" TIMESTAMP NOT NULL DEFAULT now(),
                "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_pedidos" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "detalle_pedidos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cantidad" integer NOT NULL,
                "precioUnitario" numeric(10,2) NOT NULL,
                "subtotal" numeric(10,2) NOT NULL,
                "notasEspeciales" text,
                "pedidoId" uuid NOT NULL,
                "platilloId" uuid NOT NULL,
                "fechaCreacion" TIMESTAMP NOT NULL DEFAULT now(),
                "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_detalle_pedidos" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "pedidos" 
            ADD CONSTRAINT "FK_pedidos_usuario" 
            FOREIGN KEY ("usuarioId") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "detalle_pedidos" 
            ADD CONSTRAINT "FK_detalle_pedidos_pedido" 
            FOREIGN KEY ("pedidoId") 
            REFERENCES "pedidos"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "detalle_pedidos" 
            ADD CONSTRAINT "FK_detalle_pedidos_platillo" 
            FOREIGN KEY ("platilloId") 
            REFERENCES "platillos"("id") 
            ON DELETE RESTRICT
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_pedidos_usuario" ON "pedidos" ("usuarioId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_pedidos_estado" ON "pedidos" ("estado")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_pedidos_fecha_creacion" ON "pedidos" ("fechaCreacion")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_detalle_pedidos_pedido" ON "detalle_pedidos" ("pedidoId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_detalle_pedidos_platillo" ON "detalle_pedidos" ("platilloId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_detalle_pedidos_platillo"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_detalle_pedidos_pedido"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pedidos_fecha_creacion"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pedidos_estado"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pedidos_usuario"`);
        
        await queryRunner.query(`ALTER TABLE "detalle_pedidos" DROP CONSTRAINT "FK_detalle_pedidos_platillo"`);
        await queryRunner.query(`ALTER TABLE "detalle_pedidos" DROP CONSTRAINT "FK_detalle_pedidos_pedido"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_pedidos_usuario"`);
        
        await queryRunner.query(`DROP TABLE "detalle_pedidos"`);
        await queryRunner.query(`DROP TABLE "pedidos"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_estado_enum"`);
    }
}