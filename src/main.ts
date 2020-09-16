import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as config from 'config';
import { AppModule } from '@src/app.module';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin ${serverConfig.origin}`);
  }

  const port = process.env.PORT || serverConfig.port;

  const options = new DocumentBuilder()
    .setTitle('Meowies API')
    .setDescription('API documentation for meowies -- a meal time tracker for cats (and dogs)!')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}

bootstrap();
