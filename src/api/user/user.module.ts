import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ShareModule } from './../../share/share.module';
import { JwtStrategyService } from './auth/jwt-strategy.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    // imports: [ShareModule, forwardRef(() => StatusValueModule), MongooseModule.forFeature([{ name: UserDB.name, schema: UserSchema }])],
    imports: [
        MulterModule,
        ShareModule,
        // forwardRef(() => AssessmentModule),
        // forwardRef(() => ZoneModule),
        // forwardRef(() => LineUserModule),
        // forwardRef(() => ResultAssessmentModule),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository, JwtStrategyService],
    exports: [UserService, UserRepository, JwtStrategyService],
})
export class UserModule {}
