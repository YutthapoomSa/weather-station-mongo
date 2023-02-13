import { TransactionDB } from './../../../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class FindOneTransactionByIdResDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    device_id: ObjectId;

    @ApiProperty()
    pm2: number;

    @ApiProperty()
    pm10: number;

    @ApiProperty()
    site_name: string;

    @ApiProperty()
    heat_index: number;

    @ApiProperty()
    coor_lat: number;

    @ApiProperty()
    coor_lon: number;

    @ApiProperty()
    humidity: number;

    @ApiProperty()
    temperature: number;

    @ApiProperty()
    date_data: string;
}

export class FindOneTransactionDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => FindOneTransactionByIdResDto,
        description: 'ข้อมูล',
    })
    resData: FindOneTransactionByIdResDto;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: TransactionDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new FindOneTransactionByIdResDto();
        // const config = new ConfigService();

        if (!!datas) {
            this.resData.id = datas._id;
            this.resData.device_id = datas.device_id;
            this.resData.pm2 = datas.pm2;
            this.resData.pm10 = datas.pm10;
            this.resData.site_name = datas.site_name;
            this.resData.coor_lat = datas.coor_lat;
            this.resData.coor_lon = datas.coor_lon;
            this.resData.humidity = datas.humidity;
            this.resData.temperature = datas.temperature;
            this.resData.date_data = datas.date_data;
        }
    }
}
