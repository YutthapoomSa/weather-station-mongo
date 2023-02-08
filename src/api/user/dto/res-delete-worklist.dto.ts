import { ResStatus } from './../../../share/enum/res-status.enum';
import { ApiProperty } from '@nestjs/swagger';
export class ResDeleteWorkListDto {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => ResDeleteWorkListDto,
        description: 'ข้อมูล',
    })
    resData: ResDeleteWorkListDto;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: null) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = null;
    }
}
