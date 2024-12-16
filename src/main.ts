import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  BadGatewayExceptionFilter,
  ForbiddenExceptionFilter,
  HttpExceptionFilter,
  UnauthorizedExceptionFilter,
} from './filters/http-exception.filter';
// import * as fs from 'fs';
// import * as path from 'path';

async function bootstrap() {

  // const httpsOptions = {
  //   key: fs.readFileSync(path.join(__dirname, "../localhost+2-key.pem")),
  //   cert: fs.readFileSync(path.join(__dirname, "../localhost+2.pem")),
  // };

  const app = await NestFactory.create(
    AppModule, 
    // {httpsOptions}
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // for error handeling on receiving request
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new BadGatewayExceptionFilter());

  app.setGlobalPrefix('/api/v1', { exclude: ['/'] });

  app.enableShutdownHooks();
  await app.listen(process.env.PORT, ()=> {
    console.log(`Open: https://localhost:${process.env.PORT}`);
  });
}
bootstrap();
