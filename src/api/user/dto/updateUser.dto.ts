import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConfigService } from './../../../config/config.service';
import { UserDB } from './../../../entities/user.entity';
import { ResStatus } from './../../../share/enum/res-status.enum';

export class UpdateUserReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    position: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    imageUser: string;
}

export class UpdateUserResDTOData {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    position: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    imageUser: string;
}

export class UpdateUserResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => UpdateUserResDTOData,
        description: 'ข้อมูล',
    })
    resData: any;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(resCode: ResStatus, msg: string, datas: UserDB) {
        this.resCode = resCode;
        this.msg = msg;
        this.resData = new UpdateUserResDTOData();
        const config = new ConfigService();

        if (!!datas) {
            this.resData.id  = datas._id;
            this.resData.username = datas.username;
            this.resData.password = datas.password;
            this.resData.position = datas.position;
            this.resData.phoneNumber = datas.phoneNumber;
            this.resData.imageUser = datas.imageUser ? config.imagePath().userImagePath + '/' + datas.imageUser : '';
        }
    }
}
