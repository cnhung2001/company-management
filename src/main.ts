import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP');
  
  // Enable CORS for all origins when using ngrok
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://4f2ea93ad350.ngrok-free.app',
      ""
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    // allowedHeaders: [
    //   'Content-Type',
    //   'Accept',
    //   'Authorization',
    //   'X-Requested-With',
    //   'ngrok-skip-browser-warning',
    // ],
    allowedHeaders: '*',
  });
  
  // Global filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new AllExceptionsFilter(),
  );
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Logger middleware
  app.use((req, res, next) => {
    const { method, originalUrl, body } = req;
    logger.log(`Request ${method} ${originalUrl}`);
    if (body && Object.keys(body).length > 0) {
      logger.debug(`Request body: ${JSON.stringify(body)}`);
    }
    
    // Capture response
    const originalJson = res.json;
    const originalSend = res.send;
    
    // Override send method
    res.send = function(body) {
      const statusCode = res.statusCode;
      if (statusCode >= 400) {
        let responseBody;
        try {
          if (typeof body === 'string') {
            responseBody = JSON.parse(body);
          } else {
            responseBody = body;
          }
        } catch (e) {
          responseBody = body;
        }
        logger.error(`Error ${statusCode} ${method} ${originalUrl} - ${JSON.stringify(responseBody)}`);
      } else {
        logger.log(`Response ${statusCode} ${method} ${originalUrl}`);
      }
      return originalSend.call(this, body);
    };
    
    next();
  });
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Company Management API')
    .setDescription('API documentation for Company Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  await app.listen(process.env.PORT ?? 8000);
} 
void bootstrap();
