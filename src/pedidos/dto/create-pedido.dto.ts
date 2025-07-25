import { Type } from 'class-transformer';
import { 
  IsOptional, 
  IsString, 
  IsArray, 
  ValidateNested, 
  ArrayMinSize,
  Length 
} from 'class-validator';
import { CreateDetallePedidoDto } from './create-detalle-pedido.dto';

export class CreatePedidoDto {
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  @Length(0, 500, { message: 'Las notas no pueden exceder 500 caracteres' })
  notas?: string;

  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un platillo en el pedido' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetallePedidoDto)
  detalles: CreateDetallePedidoDto[];
}