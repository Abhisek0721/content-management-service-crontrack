import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  BadGatewayExceptionFilter,
  ForbiddenExceptionFilter,
  HttpExceptionFilter,
  UnauthorizedExceptionFilter,
} from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // for error handeling on receiving request
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new BadGatewayExceptionFilter());

  app.enableShutdownHooks();
  await app.listen(process.env.PORT, ()=> {
    console.log(`Open: http://localhost:${process.env.PORT}`);
  });
}
bootstrap();
