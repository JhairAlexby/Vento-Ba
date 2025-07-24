import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  UsePipes, 
  ValidationPipe,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreatePlatilloDto } from './dto/create-platillo.dto';
import { UpdatePlatilloDto } from './dto/update-platillo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createPlatilloDto: CreatePlatilloDto, @Request() req) {
    return await this.menuService.create(createPlatilloDto, req.user.userId);
  }

  @Get()
  async findAll(@Query('usuario') usuarioId?: string) {
    if (usuarioId) {
      return await this.menuService.findAllByUser(usuarioId);
    }
    return await this.menuService.findAll();
  }

  @Get('mis-platillos')
  async findMyPlatillos(@Request() req) {
    return await this.menuService.findAllByUser(req.user.userId);
  }

  @Get('categoria/:categoria')
  async findByCategory(
    @Param('categoria') categoria: string,
    @Query('usuario') usuarioId?: string,
    @Request() req?
  ) {
    // Si no se especifica usuario, usar el usuario autenticado
    const targetUserId = usuarioId || req?.user?.userId;
    return await this.menuService.findByCategory(categoria, targetUserId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.menuService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string, 
    @Body() updatePlatilloDto: UpdatePlatilloDto,
    @Request() req
  ) {
    return await this.menuService.update(id, updatePlatilloDto, req.user.userId);
  }

  @Patch(':id/disponibilidad')
  @HttpCode(HttpStatus.OK)
  async toggleDisponibilidad(@Param('id') id: string, @Request() req) {
    return await this.menuService.toggleDisponibilidad(id, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Request() req) {
    return await this.menuService.remove(id, req.user.userId);
  }
}
