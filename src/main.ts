import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import { auth } from './middleware/auth';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50MB'}));
  app.use(bodyParser.urlencoded({ limit: '50MB', extended: true }));
  // 解决跨域
  app.enableCors()
  // 注册全局中间件
  app.use(auth);
  await app.listen(3000);
}
bootstrap();
