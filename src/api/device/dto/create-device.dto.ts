import { DeviceDB } from './../../../entities/device.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class CreateResDeviceDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    device_name: string;
}

export class CreateResDeviceDTOData {
    @ApiProperty()
    id: number;
    @ApiProperty()
    device_name: string;
}

export class CreateResDeviceDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => CreateResDeviceDTOData,
        description: 'ข้อมูล',
    })
    resData: CreateResDeviceDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: DeviceDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new CreateResDeviceDTOData();

        if (!!datas) {
            this.resData.id = datas._id;
            this.resData.device_name = datas.device_name;
        }
    }
}
