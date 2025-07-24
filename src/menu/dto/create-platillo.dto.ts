import { IsNotEmpty, IsString, IsNumber, IsUrl, IsOptional, IsBoolean, Min, Max, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePlatilloDto {
  @IsNotEmpty({ message: 'El nombre del platillo es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  @Max(9999.99, { message: 'El precio no puede exceder $9999.99' })
  @Transform(({ value }) => parseFloat(value))
  precio: number;

  @IsOptional()
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  imagenUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'Disponible debe ser verdadero o falso' })
  @Transform(({ value }) => value === 'true' || value === true)
  disponible?: boolean = true;

  @IsOptional()
  @IsString({ message: 'La categoría debe ser un texto' })
  @Length(0, 50, { message: 'La categoría no puede exceder 50 caracteres' })
  categoria?: string;
}