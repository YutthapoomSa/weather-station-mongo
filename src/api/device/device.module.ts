import { forwardRef, Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { ShareModule } from 'src/share/share.module';

@Module({
    imports: [ShareModule, forwardRef(() => DeviceModule)],
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [DeviceService],
})
export class DeviceModule {}
