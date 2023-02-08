import { ApiProperty } from '@nestjs/swagger';
import { ResStatus } from './../../../share/enum/res-status.enum';
import { ConfigService } from './../../../config/config.service';
import { UserDB, UserDBGender, UserDBPosition, UserDBPrefix, UserDBRole } from './../../../entities/user.entity';

class LoginUserResDTOResData {
    @ApiProperty()
    id: String;

    @ApiProperty()
    username: String;

    @ApiProperty()
    nickname: String;

    @ApiProperty({
        enum: Object.keys(UserDBPrefix).map((k) => UserDBPrefix[k]),
    })
    prefix: UserDBPrefix;

    @ApiProperty()
    firstName: String;

    @ApiProperty()
    lastName: String;

    @ApiProperty({
        enum: Object.keys(UserDBPosition).map((k) => UserDBPosition[k]),
    })
    position: UserDBPosition;

    @ApiProperty()
    phoneNumber: String;

    @ApiProperty()
    imageUser: String;

    @ApiProperty({
        enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
    })
    gender: UserDBGender;

    @ApiProperty({
        enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
    })
    role: UserDBRole;

    @ApiProperty()
    accessToken: String;

    @ApiProperty()
    refreshToken: String;

    @ApiProperty()
    expire: Date;
}

export class LoginUserResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => LoginUserResDTOResData,
        description: 'ข้อมูล',
    })
    resData: LoginUserResDTOResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB, accessToken: string, refreshToken: string, expire: Date) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new LoginUserResDTOResData();
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
            this.resData.accessToken = accessToken;
            this.resData.refreshToken = refreshToken;
            this.resData.expire = expire;
        }
    }
}
