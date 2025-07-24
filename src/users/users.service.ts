import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'contrasena'>[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      const { contrasena, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id: string): Promise<Omit<User, 'contrasena'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { contrasena, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(correo: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ correo });
    return user || undefined;
  }

  async create(userData: Partial<User>): Promise<User> {
    const { contrasena, ...rest } = userData;
    if (!contrasena) {
      throw new BadRequestException('Password is required');
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const newUser = this.usersRepository.create({ ...rest, contrasena: hashedPassword });
    return this.usersRepository.save(newUser);
  }

  async update(id: string, updateData: Partial<User>): Promise<Omit<User, 'contrasena'>> {
    if (updateData.contrasena) {
      updateData.contrasena = await bcrypt.hash(updateData.contrasena, 10);
    }
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}