import { ApiProperty } from '@nestjs/swagger';
import { ResStatus } from './../../share/enum/res-status.enum';

class GlobalResDTOResData {}

export class GlobalResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => GlobalResDTOResData,
        description: 'ข้อมูล',
    })
    resData: GlobalResDTOResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
    }
}
