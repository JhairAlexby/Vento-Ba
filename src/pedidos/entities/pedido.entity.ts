import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { DetallePedido } from './detalle-pedido.entity';

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  EN_PREPARACION = 'en_preparacion',
  LISTO = 'listo',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado'
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty({ message: 'El total es requerido' })
  @IsNumber({}, { message: 'El total debe ser un número' })
  @Min(0.01, { message: 'El total debe ser mayor a 0' })
  total: number;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE
  })
  @IsEnum(EstadoPedido, { message: 'Estado de pedido inválido' })
  estado: EstadoPedido;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  usuario: User;

  @Column()
  usuarioId: string;

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, { 
    cascade: true, 
    eager: true 
  })
  detalles: DetallePedido[];

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}