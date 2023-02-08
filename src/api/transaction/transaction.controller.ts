import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateResTransaction, CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { LogService } from './../../services/log.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    private logger = new LogService(TransactionController.name);

    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    @ApiOperation({ summary: 'สร้างข้อมูล Transaction' })
    @ApiOkResponse({ type: CreateResTransaction })
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return await this.transactionService.create(createTransactionDto);
    }
}
