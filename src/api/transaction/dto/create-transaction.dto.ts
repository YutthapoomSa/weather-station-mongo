import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import moment from 'moment';
import { ObjectId } from 'mongoose';
import { TransactionDB } from './../../../entities/transaction.entity';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class CreateTransactionDto {
    @ApiProperty()
    @IsOptional()
    device_id: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pm2: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pm10: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    site_name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    heat_index: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    coor_lat: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    coor_lon: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    humidity: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    temperature: number;

    @ApiProperty({ example: moment().format('YYYY-MM-DD HH:mm:ss') })
    @IsString()
    date_data: string;
}

export class CreateResTransactionData {
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

export class CreateResTransaction {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => CreateResTransactionData,
        description: 'ข้อมูล',
    })
    resData: CreateResTransactionData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: TransactionDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new CreateResTransactionData();

        if (!!datas) {
            this.resData.id = datas._id;
            this.resData.device_id = datas.device_id;
            this.resData.pm2 = datas.pm2;
            this.resData.pm10 = datas.pm10;
            this.resData.site_name = datas.site_name;
            this.resData.heat_index = datas.heat_index;
            this.resData.coor_lat = datas.coor_lat;
            this.resData.coor_lon = datas.coor_lon;
            this.resData.humidity = datas.humidity;
            this.resData.temperature = datas.temperature;
            this.resData.date_data = datas.date_data;
        }
    }
}
