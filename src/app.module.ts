import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RouterModule } from './router/router.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    })
    ,RouterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
