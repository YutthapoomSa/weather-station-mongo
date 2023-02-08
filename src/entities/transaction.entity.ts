import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DeviceDB } from './device.entity';

@Schema({
    collection: 'transaction',
    _id: true,
})
export class TransactionDB extends Document {
    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    pm2: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    pm10: number;

    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
    })
    site_name: string;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    heat_index: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    coor_lat: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    coor_lon: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    humidity: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    temperature: number;

    @Prop({
        type: MongooseSchema.Types.Date,
        required: true,
        default: new Date(),
    })
    date_data: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: DeviceDB.name,
    })
    device_id: MongooseSchema.Types.ObjectId;
}
export const TransactionSchema = SchemaFactory.createForClass(TransactionDB);
