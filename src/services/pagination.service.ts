import { LogService } from './log.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
    private logger = new LogService(PaginationService.name);
    /**
     * @param total //จำนวนที่ข้าม
     * @param perPage //จำนวนข้อมูลทั้งหมด
     * @param pageCurrent //จำนวนข้อมูลลำดับสุดท้ายที่จะดึง
     * @returns
     */
    paginationCal(total: number, perPage: number, pageCurrent: number) {
        return {
            skips: perPage * pageCurrent - perPage, // จำนวนที่ข้าม
            totalPages: Math.ceil(total / perPage), // จำนวนข้อมูลทั้งหมด
            limit: perPage, // จำนวนข้อมูลลำดับสุดท้ายที่จะดึง
        };
    }
}
