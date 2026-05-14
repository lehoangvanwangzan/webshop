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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { QueryBannersDto } from './dto/query-banners.dto';
import { JwtAuthGuard } from '@features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findAll(@Query() query: QueryBannersDto) {
    return this.bannersService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.bannersService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
    return this.bannersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.remove(id);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const bannerId = (req as any).params?.id ?? 'temp';
          const dir = path.join(
            process.cwd(),
            'picture',
            'shop_banners',
            String(bannerId),
          );
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
          cb(null, name);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
        if (allowed.test(file.originalname)) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ chấp nhận ảnh jpg/jpeg/png/webp/gif'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bannersService.uploadImage(id, file);
  }
}
