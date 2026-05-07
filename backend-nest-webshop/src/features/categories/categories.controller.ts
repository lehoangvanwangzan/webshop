import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAllTree();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }
}
