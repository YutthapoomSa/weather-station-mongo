import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import moment from 'moment';
import { ObjectId } from 'mongoose';
import { UserDBWork } from './../../../entities/user.entity';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class ZoneResDTOData {
    @ApiProperty()
    zoneId: string;
}
export class CreateWorkListReqDTO {
    @ApiProperty({})
    @IsString()
    userId: string;

    @ApiProperty({ example: moment().format('YYYY-MM-DD HH:mm:ss') })
    @IsString()
    startDate: string;

    @ApiProperty({ example: moment().format('YYYY-MM-DD HH:mm:ss') })
    @IsString()
    endDate: string;

    @ApiProperty({ example: [moment().format('YYYY-MM-DD HH:mm:ss')] })
    @IsArray()
    day: string[];

    @ApiProperty({
        type: () => [ZoneResDTOData],
    })
    @IsArray()
    zone: ZoneResDTOData[];
}

export class ZoneDetailResData {
    // @ApiProperty()
    // id: string;
    @ApiProperty()
    name: string;
    // @ApiProperty()
    // zoneList: string[];
    // @ApiProperty()
    // zoneReport?: any[];
}
export class CreateWorkListResDTOData {
    @ApiProperty()
    id: string;
    // @ApiProperty()
    // WorkListId: ObjectId;
    @ApiProperty({})
    userId: ObjectId;
    @ApiProperty()
    startDate: string;
    @ApiProperty()
    endDate: string;
    @ApiProperty()
    day: string[];
    @ApiProperty({
        type: () => [ZoneDetailResData],
    })
    zone: ZoneDetailResData[];
}

export class CreateWorkListResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => CreateWorkListResDTOData,
        description: 'ข้อมูล',
    })
    resData: CreateWorkListResDTOData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDBWork) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new CreateWorkListResDTOData();
        console.log(JSON.stringify(datas, null, 2));
        if (!!datas) {
            this.resData.id = datas.id;
            // this.resData.WorkListId = datas._id;
            // this.resData.userId = datas.userId;
            this.resData.startDate = datas.startDate;
            this.resData.endDate = datas.endDate;
            this.resData.day = datas.day;
            this.resData.zone = [];

            if (!!this.resData.zone && this.resData.zone.length > 0) {
                // const _zones: any[] = this.resData.zones;
                for (const iterator of this.resData.zone) {
                    const _data = new ZoneDetailResData();
                    // _data.id = iterator.id;
                    _data.name = iterator.name;
                    this.resData.zone.push(_data);
                }
            }
        }
    }
}
