import { ResStatus } from './../../../share/enum/res-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserDB } from './../../../entities/user.entity';

class FindOneWorkListDTOZone {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    zoneList: string[];
    @ApiProperty()
    zoneReport?: any[];
}

class FindOneWorkListDTOWorkList {
    @ApiProperty({
        type: () => [FindOneWorkListDTOZone],
    })
    zones: FindOneWorkListDTOZone[];
}

class FindOneWorkListDTOResData {
    @ApiProperty()
    _id: string;
    @ApiProperty({
        type: () => [FindOneWorkListDTOWorkList],
    })
    workList: FindOneWorkListDTOWorkList[];
}

export class FindOneWorkListDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => FindOneWorkListDTOResData,
        description: 'ข้อมูล',
    })
    resData: FindOneWorkListDTOResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new FindOneWorkListDTOResData();

        if (!!datas) {
            this.resData._id = datas._id;
            this.resData.workList = [];

            if (!!datas.workList && datas.workList.length > 0) {
                for (const iterator of datas.workList) {
                    const _findOneWorkListDTOWorkList = new FindOneWorkListDTOWorkList();
                    _findOneWorkListDTOWorkList.zones = [];

                    if (!!iterator.zone && iterator.zone.length > 0) {
                        const _zones: any[] = iterator.zone;
                        for (const iterator2 of _zones) {
                            const _findOneWorkListDTOZone = new FindOneWorkListDTOZone();
                            _findOneWorkListDTOZone._id = iterator2._id;
                            _findOneWorkListDTOZone.name = iterator2.name;
                            if (iterator2.zoneList) {
                                _findOneWorkListDTOZone.zoneList = iterator2.zoneList;
                            } else {
                                _findOneWorkListDTOZone.zoneList = [];
                            }
                            if (iterator2.zoneReport) {
                                _findOneWorkListDTOZone.zoneReport = iterator2.zoneReport;
                            } else {
                                _findOneWorkListDTOZone.zoneReport = [];
                            }

                            _findOneWorkListDTOWorkList.zones.push(_findOneWorkListDTOZone);
                        }
                    }
                    this.resData.workList.push(_findOneWorkListDTOWorkList);
                }
            }
        }
    }
}
