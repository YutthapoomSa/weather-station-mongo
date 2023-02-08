import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { EncryptionService } from './../../../services/encryption.service';
import { ConfigService } from './../../../config/config.service';
import { JwtPayload } from './jwt-payload.model';

import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(
        @Inject(forwardRef(() => UserRepository))
        private UserRepository: UserRepository,

        private encryptionService: EncryptionService,

        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJWTKey(),
        });
    }

    async validate(payload: JwtPayload, done: VerifiedCallback) {
        // console.log(payload);

        const decodeUserId = this.encryptionService.decode(payload.id);
        const result = await this.UserRepository.getUserById(decodeUserId);
        if (!result) {
            return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
        }
        return done(null, result, payload.iat);
    }
}
