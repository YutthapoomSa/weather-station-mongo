import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
    @ApiProperty({
        example: 'superAdmin',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'superAdmin',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

// export class LoginResDto{
//     @ApiProperty({
//         enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
//         description: 'รหัสสถานะ',
//     })
//     resCode: ResStatus;

//     @ApiProperty({
//         type: () => [LoginDTO],
//         description: 'ข้อมูล',
//     })
//     resData: LoginDTO[];

//     @ApiProperty({
//         description: 'ข้อความอธิบาย',
//     })
//     msg: string;

//     constructor (resStatus: ResStatus, msg: string, datas: UserDB){
//         this.resCode = resStatus;
//         this.msg = msg;
//         this.resData = [];

//         if(!!datas) {
//             const _data = new LoginDTO();
             
//         }
//     }
// }
