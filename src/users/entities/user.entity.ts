import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { IsEmail, IsNotEmpty, Length } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nombre_completo' })
  @IsNotEmpty()
  @Length(3, 100)
  nombreCompleto: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @Column()
  @IsNotEmpty()
  @Length(6, 100)
  contrasena: string;
}