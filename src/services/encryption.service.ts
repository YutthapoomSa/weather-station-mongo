import { Injectable } from '@nestjs/common';
import CryptoJS from 'crypto-js';
import { ConfigService } from './../config/config.service';

@Injectable()
export class EncryptionService {
    constructor(private configService: ConfigService) {}
    decode(textEncryption: string) {
        textEncryption = textEncryption.split('xMl3Jk').join('+');
        textEncryption = textEncryption.split('Por21Ld').join('/');
        textEncryption = textEncryption.split('Ml32').join('=');
        const text = CryptoJS.AES.decrypt(textEncryption, this.configService.getEncryptKey());
        return text.toString(CryptoJS.enc.Utf8);
    }

    encode(textEncryption: string): string {
        let data = CryptoJS.AES.encrypt(textEncryption, this.configService.getEncryptKey()).toString();
        data = data.split('+').join('xMl3Jk');
        data = data.split('/').join('Por21Ld');
        data = data.split('=').join('Ml32');
        return data;
    }
}
