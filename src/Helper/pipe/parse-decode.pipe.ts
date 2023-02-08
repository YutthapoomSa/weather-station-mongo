/*
https://docs.nestjs.com/pipes
*/
import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from './../../config/config.service';
import { EncryptionService } from './../../services/encryption.service';
import { LogService } from './../../services/log.service';

@Injectable()
export class ParseDecodePipe implements PipeTransform<string> {
    private logger = new LogService(ParseDecodePipe.name);
    constructor(private configService: ConfigService, private encryptionService: EncryptionService) { }
    transform(value: any, metadata: ArgumentMetadata): string {
        try {
            const textDecode = this.encryptionService.decode(value);
            this.logger.debug(textDecode);
            return textDecode;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
