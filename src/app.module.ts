import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ZohoController } from './zoho.controller';

@Module({
  imports: [],
  controllers: [AppController, ZohoController],
})
export class AppModule {}
