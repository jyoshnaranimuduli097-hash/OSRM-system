import { Module } from '@nestjs/common';
import { RouterController } from './router.controller.js';
import { RouterService } from './router.service.js';

@Module({
  controllers: [RouterController],
  providers: [RouterService],
  exports:[RouterService]
})
export class RouterModule {}
