import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ForbiddenException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido, EstadoPedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { UsersService } from '../users/users.service';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepository: Repository<DetallePedido>,
    private readonly usersService: UsersService,
    private readonly menuService: MenuService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto, usuarioId: string): Promise<Pedido> {
    const usuario = await this.usersService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let totalCalculado = 0;
    const detallesValidados: DetallePedido[] = [];

    for (const detalleDto of createPedidoDto.detalles) {
      const platillo = await this.menuService.findOne(detalleDto.platilloId);
      
      if (!platillo.disponible) {
        throw new BadRequestException(`El platillo "${platillo.nombre}" no está disponible`);
      }

      const subtotal = Number(platillo.precio) * detalleDto.cantidad;
      totalCalculado += subtotal;

      const detalle = this.detallePedidoRepository.create({
        platilloId: detalleDto.platilloId,
        cantidad: detalleDto.cantidad,
        precioUnitario: platillo.precio,
        subtotal: subtotal,
        notasEspeciales: detalleDto.notasEspeciales,
        platillo: platillo,
      });

      detallesValidados.push(detalle);
    }

    try {
      const pedido = this.pedidoRepository.create({
        total: totalCalculado,
        notas: createPedidoDto.notas,
        usuarioId,
        usuario,
        estado: EstadoPedido.PENDIENTE,
        detalles: detallesValidados,
      });

      return await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException('Error al crear el pedido');
    }
  }

  async findAll(): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      relations: ['usuario', 'detalles', 'detalles.platillo'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }

  async findAllByUser(usuarioId: string): Promise<Pedido[]> {
    const usuario = await this.usersService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.pedidoRepository.find({
      where: { usuarioId },
      relations: ['usuario', 'detalles', 'detalles.platillo'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }

  async findOne(id: string, usuarioId?: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.platillo'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (usuarioId && pedido.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permisos para acceder a este pedido');
    }

    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto, usuarioId: string): Promise<Pedido> {
    const pedido = await this.findOne(id, usuarioId);

    if (pedido.estado === EstadoPedido.ENTREGADO || pedido.estado === EstadoPedido.CANCELADO) {
      throw new BadRequestException('No se puede modificar un pedido entregado o cancelado');
    }

    try {
      if (updatePedidoDto.estado) {
        pedido.estado = updatePedidoDto.estado;
      }
      
      if (updatePedidoDto.notas !== undefined) {
        pedido.notas = updatePedidoDto.notas;
      }

      return await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el pedido');
    }
  }

  async updateEstado(id: string, estado: EstadoPedido, usuarioId?: string): Promise<Pedido> {
    const pedido = await this.findOne(id, usuarioId);

    if (pedido.estado === EstadoPedido.ENTREGADO || pedido.estado === EstadoPedido.CANCELADO) {
      throw new BadRequestException('No se puede cambiar el estado de un pedido entregado o cancelado');
    }

    try {
      pedido.estado = estado;
      return await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el estado del pedido');
    }
  }

  async cancel(id: string, usuarioId: string): Promise<Pedido> {
    const pedido = await this.findOne(id, usuarioId);

    if (pedido.estado === EstadoPedido.ENTREGADO) {
      throw new BadRequestException('No se puede cancelar un pedido ya entregado');
    }

    if (pedido.estado === EstadoPedido.CANCELADO) {
      throw new BadRequestException('El pedido ya está cancelado');
    }

    try {
      pedido.estado = EstadoPedido.CANCELADO;
      return await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException('Error al cancelar el pedido');
    }
  }

  async findByEstado(estado: EstadoPedido): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      where: { estado },
      relations: ['usuario', 'detalles', 'detalles.platillo'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }

  async getEstadisticas(usuarioId?: string) {
    const whereCondition = usuarioId ? { usuarioId } : {};

    const [
      totalPedidos,
      pedidosPendientes,
      pedidosConfirmados,
      pedidosEnPreparacion,
      pedidosListos,
      pedidosEntregados,
      pedidosCancelados,
    ] = await Promise.all([
      this.pedidoRepository.count({ where: whereCondition }),
      this.pedidoRepository.count({ where: { ...whereCondition, estado: EstadoPedido.PENDIENTE } }),
      this.pedidoRepository.count({ where: { ...whereCondition, estado: EstadoPedido.CONFIRMADO } }),
      this.pedidoRepository.count({ where: { ...whereCondition, estado: EstadoPedido.EN_PREPARACION } }),
      this.pedidoRepository.count({ where: { ...whereCondition, estado: EstadoPedido.LISTO } }),
      this.pedidoRepository.count({ where: { ...whereCondition, estado: EstadoPedido.ENTREGADO } }),
      this.pedidoRepository.count({ where: { ...whereCondition, estado: EstadoPedido.CANCELADO } }),
    ]);

    return {
      totalPedidos,
      pedidosPorEstado: {
        pendientes: pedidosPendientes,
        confirmados: pedidosConfirmados,
        enPreparacion: pedidosEnPreparacion,
        listos: pedidosListos,
        entregados: pedidosEntregados,
        cancelados: pedidosCancelados,
      },
    };
  }
}