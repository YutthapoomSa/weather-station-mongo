import { ResStatus } from './../../share/enum/res-status.enum';
import { DeviceDB } from './../../entities/device.entity';
import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from '@nestjs/common';
import { LogService } from './../../services/log.service';
import { CreateResDeviceDto, CreateResDeviceDTO } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DeviceService implements OnApplicationBootstrap {
    private logger = new LogService(DeviceService.name);

    constructor(
        @InjectModel(DeviceDB.name)
        private readonly deviceModel: Model<DeviceDB>,
    ) {}
    onApplicationBootstrap() {
        //
    }
    async create(createDeviceDto: CreateResDeviceDto) {
        const tag = this.create.name;
        try {
            const _create = new this.deviceModel();
            _create.device_name = createDeviceDto.device_name;

            await _create.save();
            return new CreateResDeviceDTO(ResStatus.success, 'Success', _create);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
