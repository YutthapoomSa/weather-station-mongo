import { plainToClass } from 'class-transformer';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { LogService } from './../../services/log.service';
@Injectable()
export class ValidationPipe implements PipeTransform {
    private logger = new LogService(ValidationPipe.name);

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            this.logger.error(errors);
            throw new BadRequestException(errors);
        }
        return value;
    }

    // tslint:disable-next-line:ban-types
    private toValidate(metatype: Function): boolean {
        // tslint:disable-next-line:ban-types
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
