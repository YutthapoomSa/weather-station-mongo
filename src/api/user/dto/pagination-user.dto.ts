import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import moment from 'moment';
import { ResStatus } from './../../../share/enum/res-status.enum';
import { UserDB, UserDBGender, UserDBPosition, UserDBPrefix, UserDBRole } from './../../../entities/user.entity';

export class UserPaginationDTO {
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

export class UserPaginationResDTOResDatas {
    @ApiProperty()
    id: String;

    @ApiProperty()
    username: String;

    @ApiProperty()
    nickname: String;

    @ApiProperty({
        enum: Object.keys(UserDBPrefix).map((k) => UserDBPrefix[k]),
        example: UserDBPrefix.Mr,
    })
    prefix: String;

    @ApiProperty()
    firstName: String;

    @ApiProperty()
    lastName: String;

    @ApiProperty({
        enum: Object.keys(UserDBPosition).map((k) => UserDBPosition[k]),
        example: UserDBPosition.estimate,
    })
    position: String;

    @ApiProperty()
    phoneNumber: String;

    @ApiProperty()
    imageUser: String;

    @ApiProperty({
        enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
        example: UserDBGender.MALE,
    })
    gender: String;

    @ApiProperty({
        enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
        example: UserDBRole.User,
    })
    role: String;

    @ApiProperty()
    createdAt: String;
}

class UserPaginationResDTOResData {
    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    itemsPerPage: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    currentPage: number;

    @ApiProperty({
        type: () => [UserPaginationResDTOResDatas],
    })
    datas: UserPaginationResDTOResDatas[];
}

export class UserPaginationResDTO {
    @ApiProperty({
        enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
        description: 'รหัสสถานะ',
    })
    resCode: ResStatus;

    @ApiProperty({
        type: () => UserPaginationResDTOResData,
        description: 'ข้อมูล',
    })
    resData: UserPaginationResDTOResData;

    @ApiProperty({
        description: 'ข้อความอธิบาย',
    })
    msg: string;

    constructor(
        resStatus: ResStatus,
        msg: string,
        data: UserDB[],
        totalItems: number,
        itemsPerPage: number,
        totalPages: number,
        currentPage: number,
    ) {
        this.resCode = resStatus;
        this.msg = msg;

        const _resData = new UserPaginationResDTOResData();
        _resData.itemsPerPage = itemsPerPage;
        _resData.totalItems = totalItems;
        _resData.currentPage = currentPage;
        _resData.totalPages = totalPages;
        _resData.datas = [];

        if (!!data && data.length > 0) {
            for (const item of data) {
                const _data = new UserPaginationResDTOResDatas();
                _data.id = item.id;
                _data.username = item.username;
                _data.nickname = item.nickname;
                _data.prefix = item.prefix;
                _data.firstName = item.firstName;
                _data.lastName = item.lastName;
                _data.position = item.position;
                _data.phoneNumber = item.phoneNumber;
                _data.imageUser = item.imageUser;
                _data.gender = item.gender;
                _data.role = item.role;
                _data.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss');

                _resData.datas.push(_data);
            }
            this.resData = _resData;
        }
    }
}
