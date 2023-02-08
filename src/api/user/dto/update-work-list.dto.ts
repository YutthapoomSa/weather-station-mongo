import { ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateWorkListReqDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    workListId: string;

    @ApiProperty()
    @IsDateString()
    startDate: Date;

    @ApiProperty()
    @IsDateString()
    endDate: Date;

    @ApiProperty()
    @IsArray()
    zone: string[];
}

export class UpdateWorkListResDTOData {
    @ApiProperty()
    id: ObjectId;
    @ApiProperty()
    workListId: string;
    @ApiProperty()
    startDate: Date;
    @ApiProperty()
    endDate: Date;
    @ApiProperty()
    zones: string[];
}
