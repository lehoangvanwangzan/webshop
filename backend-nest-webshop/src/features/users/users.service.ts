import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginatedResponse } from '@shared/types/pagination.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findAll(query: QueryUsersDto): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 20, search, is_active, role, sort_by = 'created_at', sort_order = 'DESC' } = query;

    // Whitelist cột được phép sort — tránh SQL injection
    const ALLOWED_SORT = ['id', 'full_name', 'email', 'role', 'is_active', 'created_at'];
    const sortCol = ALLOWED_SORT.includes(sort_by) ? sort_by : 'created_at';
    const sortDir = sort_order === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.userRepo.createQueryBuilder('u');

    if (search) {
      qb.andWhere(
        '(u.full_name LIKE :s OR u.email LIKE :s OR u.phone LIKE :s)',
        { s: `%${search}%` },
      );
    }
    if (is_active !== undefined) qb.andWhere('u.is_active = :is_active', { is_active });
    if (role) qb.andWhere('u.role = :role', { role });

    qb.orderBy(`u.${sortCol}`, sortDir)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Người dùng #${id} không tồn tại`);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Người dùng #${id} không tồn tại`);
    await this.userRepo.delete(id);
    return { deleted: true };
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<{ success: boolean }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Người dùng #${id} không tồn tại`);
    user.password = await bcrypt.hash(dto.new_password, 10);
    await this.userRepo.save(user);
    return { success: true };
  }

  async createByAdmin(dto: CreateUserDto, avatarUrl?: string): Promise<User> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email đã được sử dụng');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
      role: dto.role ?? 'customer',
      is_active: dto.is_active ?? true,
      avatar_url: avatarUrl,
    });
    return this.userRepo.save(user);
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<{ updated: boolean }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Người dùng #${id} không tồn tại`);
    await this.userRepo.update(id, { avatar_url: avatarUrl });
    return { updated: true };
  }

  async removeAvatar(id: number): Promise<{ updated: boolean }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Người dùng #${id} không tồn tại`);
    await this.userRepo.update(id, { avatar_url: undefined });
    return { updated: true };
  }
}
