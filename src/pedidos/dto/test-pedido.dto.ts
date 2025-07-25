import { IsArray, IsOptional, IsString } from 'class-validator';

export class TestPedidoDto {
  @IsOptional()
  @IsString()
  notas?: string;

  @IsArray()
  detalles: any[];
}