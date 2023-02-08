import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { UserDB } from './../../../entities/user.entity';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class FindAllUserResDTOData {
    @ApiProperty()
    id: ObjectId;

    // @ApiProperty()
    // username: string;

    // @ApiProperty()
    // nickname: string;

    // @ApiProperty({
    //     enum: Object.keys(UserDBPrefix).map((k) => UserDBPrefix[k]),
    // })
    // prefix: UserDBPrefix;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    // @ApiProperty({
    //     enum: Object.keys(UserDBPosition).map((k) => UserDBPosition[k]),
    // })
    // position: UserDBPosition;

    // @ApiProperty()
    // phoneNumber: string;

    // @ApiProperty()
    // imageUser: string;

    // @ApiProperty({
    //     enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
    // })
    // gender: UserDBGender;

    // @ApiProperty({
    //     enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
    // })
    // role: UserDBRole;
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
                // _data.username = iterator.username;
                // _data.nickname = iterator.nickname;
                // _data.prefix = iterator.prefix;
                _data.firstName = iterator.firstName;
                _data.lastName = iterator.lastName;
                // _data.position = iterator.position;
                // _data.phoneNumber = iterator.phoneNumber;
                // // _data.imageUser = iterator.imageUser ? config.imagePath().userImagePath + '/' + datas.imageUser : '';
                // _data.gender = iterator.gender;
                // _data.role = iterator.role;
                this.resData.push(_data);
            }
        }
    }
}
