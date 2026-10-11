import { Controller, Post, Body, Req } from '@nestjs/common';
import { InputdataDto } from './dto/input-data.dto.js';
import { RouterService } from './router.service.js';
import type { Request as ExpressRequest } from 'express';

@Controller('router')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}
  @Post()
  async findRoute(
    @Body() inputdataDto: InputdataDto,
    @Req() req: ExpressRequest,
  ) {
    const graph = req.app.get('graph');
    const startNode = this.routerService.findNearstRodeNode(
      graph,
      inputdataDto.startLocation,
    )!;
    const goalNode = this.routerService.findNearstRodeNode(
      graph,
      inputdataDto.goalLocation,
    )!;
    const path = this.routerService.astar(graph, startNode, goalNode);

    if (!path) {
      return { message: 'No route found', path: [] };
    }

    return {
      path: path.map((id) => graph[id]),
    };
  }
}
