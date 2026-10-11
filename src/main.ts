import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RouterService } from './router/router.service.js';



async function bootstrap() {
const app = await NestFactory.create(AppModule);
  app.enableCors();
try {
// Get RouterService from NestJS dependency injection
const routerService = app.get(RouterService);
// Initialize the road graph before accepting requests
const graph = await routerService.initializeGraph();
// Same idea as Express: app.set('graph', graph)
app.getHttpAdapter().getInstance().set('graph', graph);


  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true
  }))

  const configService = app.get(ConfigService)
  const PORT = configService.get<number>('PORT') || 5000
  await app.listen(PORT,()=>{
    console.log(`app running on http://localhost:${PORT}`)
  });

} catch (err) {
console.error('Failed to initialize server:', err);
await app.close();
process.exitCode = 1;
}
}

bootstrap();