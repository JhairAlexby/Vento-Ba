import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreatePedidoDto } from './create-pedido.dto';
import { EstadoPedido } from '../entities/pedido.entity';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsOptional()
  @IsEnum(EstadoPedido, { message: 'Estado de pedido inválido' })
  estado?: EstadoPedido;
}