 import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { AppModule } from './app.module';
import { LogService } from './services/log.service';
import { setupSwagger } from './swagger';
import compression = require('compression');

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: '*',
        methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
        maxAge: 3600,
    });
    app.useGlobalPipes(new ValidationPipe());
    app.use(json({ limit: '300mb' }));
    app.use(compression());
    app.use(urlencoded({ extended: true, limit: '300mb' }));
    app.set('x-powered-by', false);

    // ────────────────────────────────────────────────────────────────────────────────

    const pathUploadPath = path.join(__dirname, './../', 'upload');
    if (!fs.existsSync(pathUploadPath)) fs.mkdirSync(pathUploadPath);

    // ────────────────────────────────────────────────────────────────────────────────

    // const pathLine = pathUploadPath + '/line';
    // if (!fs.existsSync(pathLine)) fs.mkdirSync(pathLine);

    // const pathProfile = pathUploadPath + '/profile';
    // if (!fs.existsSync(pathProfile)) fs.mkdirSync(pathProfile);

    

    // ────────────────────────────────────────────────────────────────────────────────

    // const pathImageUser = pathUploadPath + '/image-user';
    // if (!fs.existsSync(pathImageUser)) fs.mkdirSync(pathImageUser);
    // app.useStaticAssets(path.resolve(__dirname, './../upload', 'image-user'), { prefix: '/userImage' });

    // const pathAssessment = pathUploadPath + '/imageAssessment';
    // if (!fs.existsSync(pathAssessment)) fs.mkdirSync(pathAssessment);
    // app.useStaticAssets(path.resolve(__dirname, './../upload', 'imageAssessment'), { prefix: '/ResultImageAssessment' });

    // ────────────────────────────────────────────────────────────────────────────────

    // app.useStaticAssets(path.resolve(__dirname, './../upload', 'doc'), { prefix: '/img' });

    const logService = new LogService('DB');
    // ────────────────────────────────────────────────────────────────────────────────
    mongoose.set('debug', true);
    mongoose.set('debug', (collectionName, method, query, doc) => {
        logService.db(`${collectionName}.${method}`, JSON.stringify(query), doc);
    });

    // ────────────────────────────────────────────────────────────────────────────────

    setupSwagger(app);

    // ─────────────────────────────────────────────────────────────────

    await app.listen(3000);
}
bootstrap();
