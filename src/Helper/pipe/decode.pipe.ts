import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from './../../config/config.service';
import { EncryptionService } from './../../services/encryption.service';
import { LogService } from './../../services/log.service';


@Injectable()
export class DecodePipe implements PipeTransform {
    constructor(private configService: ConfigService, private encryptionService: EncryptionService) { }
    private logger = new LogService(DecodePipe.name);
    transform(value: BodyEncode, metadata: ArgumentMetadata) {
        console.log(value);
        if (!value) throw new HttpException('data no encrypt #1.', HttpStatus.BAD_REQUEST);
        if (!value.data) throw new HttpException('data no encrypt #2.', HttpStatus.BAD_REQUEST);
        let json = null;
        let textDecode = null;
        try {
            textDecode = this.encryptionService.decode(value.data);
            console.log(textDecode);
            json = JSON.parse(textDecode);
            this.logger.debug(JSON.stringify(json));
        } catch (error) {
            this.logger.debug(textDecode);
            this.logger.error(error);
        }

        return json;
    }
}

interface BodyEncode {
    data: string;
}
