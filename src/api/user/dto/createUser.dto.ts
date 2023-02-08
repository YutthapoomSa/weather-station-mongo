import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDBGender, UserDBPosition, UserDBPrefix, UserDBRole } from './../../../entities/user.entity';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        enum: Object.keys(UserDBPrefix).map((k) => UserDBPrefix[k]),
    })
    @IsNotEmpty()
    @IsString()
    prefix: UserDBPrefix;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        enum: Object.keys(UserDBPosition).map((k) => UserDBPosition[k]),
    })
    @IsNotEmpty()
    @IsString()
    position: UserDBPosition;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imageUser: string;

    @ApiProperty({
        enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
    })
    @IsNotEmpty()
    @IsString()
    gender: UserDBGender;

    @ApiProperty({
        enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
    })
    @IsNotEmpty()
    @IsString()
    role: UserDBRole;
}
