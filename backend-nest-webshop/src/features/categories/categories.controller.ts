import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from './dto/create-child-category.dto';
import { JwtAuthGuard } from '@features/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAllTree();
  }

  // Phải khai báo trước /:slug để NestJS không match "flat" như một slug
  @Get('flat')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findFlat() {
    return this.categoriesService.findAllFlat();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }

  // ── ChildCategory endpoints ──

  @Get('children/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAllChildren() {
    return this.categoriesService.findAllChildren();
  }

  @Post('children')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createChild(@Body() dto: CreateChildCategoryDto) {
    return this.categoriesService.createChild(dto);
  }

  @Patch('children/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateChild(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChildCategoryDto) {
    return this.categoriesService.updateChild(id, dto);
  }

  @Delete('children/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeChild(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.removeChild(id);
  }
}
