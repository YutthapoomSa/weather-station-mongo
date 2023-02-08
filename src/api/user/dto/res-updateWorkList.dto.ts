import { ApiProperty } from '@nestjs/swagger';
import { ResStatus } from './../../../share/enum/res-status.enum';
import { UserDB } from './../../../entities/user.entity';

class ResUpdateWorkListDTO {
    _id: string;
    workList: WorkList[];
}

class WorkList {
    startDate: Date;
    endDate: Date;
    zones: Zone[];
    _id: string;
}

class Zone {
    _id: string;
    name: string;
    zoneList: string[];
}

export class ResUpdateWorkListDTOList {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => ResUpdateWorkListDTO,
        description: 'ข้อมูล',
    })
    resData: ResUpdateWorkListDTO;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new ResUpdateWorkListDTO();

        if (!!datas) {
            this.resData._id = datas._id;
            this.resData.workList = [];

            if (!!datas.workList && datas.workList.length > 0) {
                for (const iterator of datas.workList) {
                    const _workList = new WorkList();
                    _workList._id = iterator.id;
                    _workList.startDate = new Date(iterator.startDate);
                    _workList.endDate = new Date(iterator.endDate);
                    _workList.zones = [];

                    if (iterator.zone.length > 0) {
                        const _zones: any[] = iterator.zone;
                        for (const iterator2 of _zones) {
                            const _zones = new Zone();
                            _zones._id = iterator2._id;
                            _zones.name = iterator2.name;
                            _zones.zoneList = [];

                            if (iterator2.zoneList.length > 0) {
                                for (const iterator3 of iterator2.zoneList) {
                                    _zones.zoneList.push(iterator3);
                                }
                            }
                            _workList.zones.push(_zones);
                        }
                    }
                    this.resData.workList.push(_workList);
                }
            }
        }
    }
}
