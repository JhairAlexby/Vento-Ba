import { Transform } from 'class-transformer';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsNumber, 
  IsUUID, 
  IsPositive, 
  Min, 
  Max,
  Length 
} from 'class-validator';

export class CreateDetallePedidoDto {
  @IsNotEmpty({ message: 'El ID del platillo es requerido' })
  @IsUUID('4', { message: 'El ID del platillo debe ser un UUID válido' })
  platilloId: string;

  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(99, { message: 'La cantidad máxima es 99' })
  @Transform(({ value }) => Number(value))
  cantidad: number;

  @IsOptional()
  @IsString({ message: 'Las notas especiales deben ser texto' })
  @Length(0, 200, { message: 'Las notas especiales no pueden exceder 200 caracteres' })
  notasEspeciales?: string;
}