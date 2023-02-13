import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { UserDB } from './../../../entities/user.entity';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class FindAllUserResDTOData {
    @ApiProperty()
    id: ObjectId;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
}

export class FindAllUserResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => [FindAllUserResDTOData],
        description: 'ข้อมูล',
    })
    resData: FindAllUserResDTOData[];

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB[]) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = [];
        // const config = new ConfigService();

        if (!!datas) {
            for (const iterator of datas) {
                const _data = new FindAllUserResDTOData();
                _data.id = iterator._id;
                _data.firstName = iterator.firstName;
                _data.lastName = iterator.lastName;
                this.resData.push(_data);
            }
        }
    }
}
