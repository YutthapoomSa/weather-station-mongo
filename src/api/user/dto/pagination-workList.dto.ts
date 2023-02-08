import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { UserDBWork } from './../../../entities/user.entity';
import { ResStatus } from './../../../share/enum/res-status.enum';

class ZoneDetailResDTO {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    zoneList: string[];
}

export class WorkListPaginationDTOResData {
    @ApiProperty()
    id: ObjectId;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    startDate: string;
    @ApiProperty()
    endDate: string;
    @ApiProperty()
    day: string[];
    @ApiProperty({
        type: [ZoneDetailResDTO],
    })
    zoneList: ZoneDetailResDTO[];
}

export class WorkListPaginationDTO {
    @ApiProperty({
        example: '10',
    })
    @IsNotEmpty()
    @IsNumber()
    perPages: number;

    @ApiProperty({
        example: '1',
    })
    @IsNumber()
    @IsNotEmpty()
    page: number;

    @ApiProperty({
        example: '',
    })
    @IsString()
    search: string;
}
// // ────────────────────────────────────────────────────────────────────────────────
export class Zone {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    zoneList: string[];
    @ApiProperty()
    checkList: string;
    @ApiProperty()
    estimate: string;
    // __v: number
}

export class WorkList {
    @ApiProperty()
    startDate: string;
    @ApiProperty()
    endDate: string;
    @ApiProperty()
    day: string[];
    @ApiProperty()
    zone: Zone[];
    @ApiProperty()
    _id: string;
}
export class WorkListPaginationDTOResDataRes {
    @ApiProperty()
    id: String;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty({
        type: [WorkList],
    })
    workList: WorkList[];
}

class WorkListPaginationResDTOResData {
    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    itemsPerPage: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    currentPage: number;

    @ApiProperty({
        type: () => [WorkListPaginationDTOResData],
    })
    datas: any[];
}

export class WorkListPaginationResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => WorkListPaginationResDTOResData,
        description: 'ข้อมูล',
    })
    resData: WorkListPaginationResDTOResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resStatus: ResStatus, msg: string, data: any[], totalItems: number, itemsPerPage: number, totalPages: number, currentPage: number) {
        this.resCode = resStatus;
        this.msg = msg;

        const _resData = new WorkListPaginationResDTOResData();
        _resData.itemsPerPage = itemsPerPage;
        _resData.totalItems = totalItems;
        _resData.currentPage = currentPage;
        _resData.totalPages = totalPages;
        _resData.datas = [];
        console.log(JSON.stringify(data, null, 2));

        if (!!data && data.length > 0) {
            for (const item of data) {
                const _data = new WorkListPaginationDTOResDataRes();
                _data.id = item.id;
                _data.firstName = item.firstName;
                _data.lastName = item.lastName;
                _data.workList = [];
                if (!!item.workList) {
                    for (const iterator of item.workList) {
                        const workList = new WorkList();
                        workList._id = iterator._id;
                        workList.startDate = iterator.startDate;
                        workList.endDate = iterator.endDate;
                        workList.day = [];
                        if (!!iterator.day) {
                            for (const day of iterator.day) {
                                workList.day.push(day);
                            }
                        }
                        workList.zone = [];
                        if (!!iterator.zone) {
                            for (const zone of iterator.zone) {
                                const tmpZone = new Zone();
                                tmpZone._id = zone._id;
                                tmpZone.name = zone.name;
                                tmpZone.zoneList = [];
                                if (!!zone.zoneList && zone.zoneList.length > 0) {
                                    for (const zoneList of zone.zoneList) {
                                        tmpZone.zoneList.push(zoneList);
                                    }
                                }
                                tmpZone.checkList = zone.checkList;
                                tmpZone.estimate = zone.estimate;
                                workList.zone.push(tmpZone);
                            }
                        }
                        _data.workList.push(workList);
                    }
                }
                _resData.datas.push(_data);
            }
            this.resData = _resData;
        }
    }
}
