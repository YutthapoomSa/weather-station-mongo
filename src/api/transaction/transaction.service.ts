import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Model } from 'mongoose';
import { TransactionDB } from './../../entities/transaction.entity';
import { LogService } from './../../services/log.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { CreateResTransaction, CreateResTransactionData, CreateTransactionDto } from './dto/create-transaction.dto';

const lineNotify = require('line-notify-nodejs')('d3K7eG2kRtKVOA7RYQqESarSUwqQHGCvBjgQInDWN0E');
@Injectable()
export class TransactionService implements OnApplicationBootstrap {
    private logger = new LogService(TransactionService.name);

    constructor(
        @InjectModel(TransactionDB.name)
        private readonly transactionModel: Model<TransactionDB>,
    ) {}
    onApplicationBootstrap() {
        //
    }
    async create(createTransactionDto: CreateTransactionDto) {
        let transaction: TransactionDB = null;

        transaction = await this.transactionModel.create({
            device_id: createTransactionDto.device_id ? new mongoose.Types.ObjectId(createTransactionDto.device_id) : null,
            pm2: createTransactionDto.pm2,
            pm10: createTransactionDto.pm10,
            site_name: createTransactionDto.site_name,
            heat_index: createTransactionDto.heat_index,
            coor_lat: createTransactionDto.coor_lat,
            coor_lon: createTransactionDto.coor_lon,
            humidity: createTransactionDto.humidity,
            temperature: createTransactionDto.temperature,
            date_data: createTransactionDto.date_data,
        });
        console.log('transaction', JSON.stringify(transaction));

        try {
            const resultNoti = await transaction.save();
            const event = 'บันทึกข้อมูลสำเร็จ';

            if (resultNoti) await this.lineNotifySend(event, createTransactionDto);

            return new CreateResTransaction(ResStatus.success, 'Success', resultNoti);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async lineNotifySend(event: string, body: CreateTransactionDto) {
        const tag = this.lineNotifySend.name;
        try {
            lineNotify
                .notify({
                    message: `
                    \n site_name: ${body.site_name} 
                    \n PM2.5: ${body.pm2} 
                    \n PM10: ${body.pm10} 
                    \n Latitude: ${body.coor_lat} 
                    \n Longitude: ${body.coor_lon} 
                    \n Temperature: ${body.temperature} 
                    \n humidity : ${body.humidity} 
                    \n Data: ${body.date_data} 
                    \n สถานะ: ${event}
                    \n เวลา : ${moment().locale('th').add(543, 'year').format('DD MM YYYY, h:mm:ss')}`,
                })
                .then(() => {
                    console.log('send completed!');
                });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
