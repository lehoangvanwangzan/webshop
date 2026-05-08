import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '@features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Cấu hình multer lưu file vào picture/user/ */
const avatarStorage = diskStorage({
  destination: join(process.cwd(), 'picture', 'user'),
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase() || '.jpg';
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}${ext}`);
  },
});

const avatarFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: (err: Error | null, accept: boolean) => void,
) => {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    cb(new BadRequestException('Chỉ chấp nhận ảnh JPEG, PNG, WebP hoặc GIF'), false);
  } else {
    cb(null, true);
  }
};

/** Xoá file vật lý cũ nếu tồn tại */
function deleteOldFile(avatarUrl: string | null | undefined) {
  if (!avatarUrl) return;
  try {
    // avatarUrl dạng /picture/user/xxx.jpg
    const filePath = join(process.cwd(), avatarUrl);
    if (existsSync(filePath)) unlinkSync(filePath);
  } catch { /* bỏ qua lỗi xoá file */ }
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  /**
   * POST /users – tạo người dùng kèm avatar tuỳ chọn
   * Content-Type: multipart/form-data
   */
  @Post()
  @UseInterceptors(FileInterceptor('avatar', {
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: MAX_SIZE_BYTES },
  }))
  async create(
    @Body() body: Record<string, string>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: CreateUserDto = {
      full_name: body.full_name,
      email: body.email,
      password: body.password,
      phone: body.phone || undefined,
      role: (body.role as CreateUserDto['role']) || undefined,
      is_active: body.is_active !== undefined ? body.is_active === 'true' : undefined,
    };

    // Đường dẫn public lưu vào DB: /picture/user/filename.jpg
    const avatarUrl = file ? `/picture/user/${file.filename}` : undefined;

    return this.usersService.createByAdmin(dto, avatarUrl);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/password')
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, dto);
  }

  /**
   * PATCH /users/:id/avatar – cập nhật ảnh đại diện
   * Xoá file cũ trước khi lưu file mới
   */
  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: MAX_SIZE_BYTES },
  }))
  async updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Vui lòng chọn file ảnh');

    // Lấy URL cũ để xoá file vật lý
    const user = await this.usersService.findById(id);
    deleteOldFile(user?.avatar_url);

    const avatarUrl = `/picture/user/${file.filename}`;
    return this.usersService.updateAvatar(id, avatarUrl);
  }

  /** DELETE /users/:id/avatar – xoá ảnh đại diện + file vật lý */
  @Delete(':id/avatar')
  async removeAvatar(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    deleteOldFile(user?.avatar_url);
    return this.usersService.removeAvatar(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    // Xoá file avatar vật lý khi xoá user
    const user = await this.usersService.findById(id);
    deleteOldFile(user?.avatar_url);
    return this.usersService.remove(id);
  }
}
