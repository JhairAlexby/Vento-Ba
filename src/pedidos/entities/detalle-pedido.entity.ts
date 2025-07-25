import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { Pedido } from './pedido.entity';
import { Platillo } from '../../menu/entities/platillo.entity';

@Entity('detalle_pedidos')
export class DetallePedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(99, { message: 'La cantidad máxima es 99' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty({ message: 'El precio unitario es requerido' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0.01, { message: 'El precio unitario debe ser mayor a 0' })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty({ message: 'El subtotal es requerido' })
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @Min(0.01, { message: 'El subtotal debe ser mayor a 0' })
  subtotal: number;

  @Column({ type: 'text', nullable: true })
  notasEspeciales?: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { onDelete: 'CASCADE' })
  pedido: Pedido;

  @Column()
  pedidoId: string;

  @ManyToOne(() => Platillo, { eager: true })
  platillo: Platillo;

  @Column()
  platilloId: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}