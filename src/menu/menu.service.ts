import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlatilloDto } from './dto/create-platillo.dto';
import { UpdatePlatilloDto } from './dto/update-platillo.dto';
import { Platillo } from './entities/platillo.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Platillo)
    private readonly platilloRepository: Repository<Platillo>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPlatilloDto: CreatePlatilloDto, usuarioId: string): Promise<Platillo> {
    try {
      // Verificar que el usuario existe
      const usuario = await this.usersService.findOne(usuarioId);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const platillo = this.platilloRepository.create({
        ...createPlatilloDto,
        usuarioId,
        usuario,
      });

      return await this.platilloRepository.save(platillo);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el platillo');
    }
  }

  async findAll(): Promise<Platillo[]> {
    return await this.platilloRepository.find({
      relations: ['usuario'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
    });
  }

  async findAllByUser(usuarioId: string): Promise<Platillo[]> {
    // Verificar que el usuario existe
    const usuario = await this.usersService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.platilloRepository.find({
      where: { usuarioId },
      relations: ['usuario'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
    });
  }

  async findOne(id: string, usuarioId?: string): Promise<Platillo> {
    const platillo = await this.platilloRepository.findOne({
      where: { id },
      relations: ['usuario'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
    });

    if (!platillo) {
      throw new NotFoundException('Platillo no encontrado');
    }

    // Si se proporciona usuarioId, verificar que el platillo pertenece al usuario
    if (usuarioId && platillo.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permisos para acceder a este platillo');
    }

    return platillo;
  }

  async update(id: string, updatePlatilloDto: UpdatePlatilloDto, usuarioId: string): Promise<Platillo> {
    const platillo = await this.findOne(id, usuarioId);

    try {
      Object.assign(platillo, updatePlatilloDto);
      return await this.platilloRepository.save(platillo);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el platillo');
    }
  }

  async remove(id: string, usuarioId: string): Promise<{ message: string }> {
    const platillo = await this.findOne(id, usuarioId);

    try {
      await this.platilloRepository.remove(platillo);
      return { message: 'Platillo eliminado exitosamente' };
    } catch (error) {
      throw new BadRequestException('Error al eliminar el platillo');
    }
  }

  async findByCategory(categoria: string, usuarioId?: string): Promise<Platillo[]> {
    const whereCondition: any = { categoria };
    
    if (usuarioId) {
      whereCondition.usuarioId = usuarioId;
    }

    return await this.platilloRepository.find({
      where: whereCondition,
      relations: ['usuario'],
      select: {
        usuario: {
          id: true,
          nombreCompleto: true,
          correo: true,
        },
      },
    });
  }

  async toggleDisponibilidad(id: string, usuarioId: string): Promise<Platillo> {
    const platillo = await this.findOne(id, usuarioId);
    
    platillo.disponible = !platillo.disponible;
    
    try {
      return await this.platilloRepository.save(platillo);
    } catch (error) {
      throw new BadRequestException('Error al cambiar la disponibilidad del platillo');
    }
  }
}
