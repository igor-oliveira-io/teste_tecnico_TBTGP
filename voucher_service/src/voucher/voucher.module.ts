import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [VoucherService, PrismaService],
  controllers: [VoucherController],
})
export class VoucherModule {}
