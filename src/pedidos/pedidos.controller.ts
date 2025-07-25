import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  UseGuards, 
  Request, 
  UsePipes, 
  ValidationPipe,
  Query,
  HttpCode,
  HttpStatus,
  ParseEnumPipe
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { TestPedidoDto } from './dto/test-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EstadoPedido } from './entities/pedido.entity';

@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createPedidoDto: CreatePedidoDto, @Request() req) {
    return await this.pedidosService.create(createPedidoDto, req.user.userId);
  }

  @Post('test-debug')
  async testDebug(@Body() body: any) {
    console.log('🔍 Raw body:', body);
    console.log('🔍 Detalles type:', typeof body.detalles);
    console.log('🔍 Is array:', Array.isArray(body.detalles));
    console.log('🔍 Detalles content:', body.detalles);
    
    return {
      received: body,
      detallesType: typeof body.detalles,
      isArray: Array.isArray(body.detalles),
      detallesLength: body.detalles ? body.detalles.length : 'undefined'
    };
  }

  @Post('test-validation')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async testValidation(@Body() testDto: TestPedidoDto) {
    console.log('✅ Validation passed:', testDto);
    return {
      message: 'Validation successful',
      data: testDto
    };
  }

  @Get()
  async findAll(@Query('usuario') usuarioId?: string) {
    if (usuarioId) {
      return await this.pedidosService.findAllByUser(usuarioId);
    }
    return await this.pedidosService.findAll();
  }

  @Get('mis-pedidos')
  async findMyPedidos(@Request() req) {
    return await this.pedidosService.findAllByUser(req.user.userId);
  }

  @Get('estadisticas')
  async getEstadisticas(@Query('usuario') usuarioId?: string, @Request() req?) {
    const targetUserId = usuarioId || req?.user?.userId;
    return await this.pedidosService.getEstadisticas(targetUserId);
  }

  @Get('estado/:estado')
  async findByEstado(
    @Param('estado', new ParseEnumPipe(EstadoPedido)) estado: EstadoPedido
  ) {
    return await this.pedidosService.findByEstado(estado);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.pedidosService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string, 
    @Body() updatePedidoDto: UpdatePedidoDto,
    @Request() req
  ) {
    return await this.pedidosService.update(id, updatePedidoDto, req.user.userId);
  }

  @Patch(':id/estado')
  @HttpCode(HttpStatus.OK)
  async updateEstado(
    @Param('id') id: string,
    @Body('estado', new ParseEnumPipe(EstadoPedido)) estado: EstadoPedido,
    @Request() req
  ) {
    return await this.pedidosService.updateEstado(id, estado, req.user.userId);
  }

  @Patch(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string, @Request() req) {
    return await this.pedidosService.cancel(id, req.user.userId);
  }
}