import { ApiProperty } from '@nestjs/swagger';
import { UserDB, UserDBGender, UserDBPosition, UserDBPrefix, UserDBRole } from '../../../entities/user.entity';
import { ConfigService } from './../../../config/config.service';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class FindOneUserByIdResDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty({
        enum: Object.keys(UserDBPrefix).map((k) => UserDBPrefix[k]),
    })
    prefix: UserDBPrefix;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty({
        enum: Object.keys(UserDBPosition).map((k) => UserDBPosition[k]),
    })
    position: UserDBPosition;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    imageUser: string;

    @ApiProperty({
        enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
    })
    gender: UserDBGender;

    @ApiProperty({
        enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
    })
    role: UserDBRole;
}

export class FindOneUserDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => FindOneUserByIdResDto,
        description: 'ข้อมูล',
    })
    resData: FindOneUserByIdResDto;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new FindOneUserByIdResDto();
        const config = new ConfigService();

        if (!!datas) {
            this.resData.id = datas._id;
            this.resData.username = datas.username;
            this.resData.nickname = datas.nickname;
            this.resData.prefix = datas.prefix;
            this.resData.firstName = datas.firstName;
            this.resData.lastName = datas.lastName;
            this.resData.position = datas.position;
            this.resData.phoneNumber = datas.phoneNumber;
            this.resData.imageUser = datas.imageUser ? config.imagePath().userImagePath + '/' + datas.imageUser : '';
            this.resData.gender = datas.gender;
            this.resData.role = datas.role;
        }
    }
}
