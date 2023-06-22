import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Specify the views directory and the default template engine
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
