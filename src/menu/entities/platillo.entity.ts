import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber, IsUrl, Min, Max, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity('platillos')
export class Platillo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @IsNotEmpty({ message: 'El nombre del platillo es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  @Max(9999.99, { message: 'El precio no puede exceder $9999.99' })
  precio: number;

  @Column({ length: 500, nullable: true })
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  imagenUrl?: string;

  @Column({ default: true })
  disponible: boolean;

  @Column({ length: 50, nullable: true })
  @IsString({ message: 'La categoría debe ser un texto' })
  @Length(0, 50, { message: 'La categoría no puede exceder 50 caracteres' })
  categoria?: string;

  @ManyToOne(() => User, (user) => user.platillos, { onDelete: 'CASCADE' })
  usuario: User;

  @Column()
  usuarioId: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}