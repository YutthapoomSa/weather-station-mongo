import { PartialType } from '@nestjs/swagger';
import { CreateResDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends PartialType(CreateResDeviceDto) {}
