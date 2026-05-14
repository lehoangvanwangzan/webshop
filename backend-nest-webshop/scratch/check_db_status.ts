
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/features/products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../src/features/products/entities/product.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productRepo = app.get<Repository<Product>>(getRepositoryToken(Product));
  
  const products = await productRepo.find();
  console.log(`Total products in DB: ${products.length}`);
  
  const statusCounts = {};
  products.forEach(p => {
    statusCounts[p.is_active] = (statusCounts[p.is_active] || 0) + 1;
  });
  
  console.log('Status counts:', statusCounts);
  
  await app.close();
}

bootstrap();
