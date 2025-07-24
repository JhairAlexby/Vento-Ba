import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Platillo } from '../../menu/entities/platillo.entity';

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

  @OneToMany(() => Platillo, (platillo) => platillo.usuario)
  platillos: Platillo[];
}