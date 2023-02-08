import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateResDeviceDto, CreateResDeviceDTO } from './dto/create-device.dto';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Post()
    @ApiOperation({ summary: 'สร้างข้อมูล Device' })
    @ApiOkResponse({ type: CreateResDeviceDTO })
    async create(@Body() createDeviceDto: CreateResDeviceDto) {
        return await this.deviceService.create(createDeviceDto);
    }
}
