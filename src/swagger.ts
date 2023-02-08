import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

// const options = new DocumentBuilder().setTitle('Nest.js example API').setDescription('API Documentation').setVersion('1.0').addBearerAuth().build();

// const document = SwaggerModule.createDocument(app, options);
// // SwaggerModule.setup('apiSwaggerForPushData', app, document);

// SwaggerModule.setup(`${new ConfigService().baseUrl}/api`, app, document);
export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder().setTitle('API').setDescription('API Documentation').setVersion('0.0.0').addBearerAuth().build();

    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            displayRequestDuration: true,
        },
    };

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document, customOptions);
}
