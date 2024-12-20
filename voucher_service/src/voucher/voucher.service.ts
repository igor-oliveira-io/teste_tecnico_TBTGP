import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Voucher, Prisma } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VoucherService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // Cron job checking expired status
  @Cron(process.env.CRON_SCHEDULE)
  handleCron() {
    this.checkAndUpdateStatusExpired();
  }

  async createVoucher(data: Prisma.VoucherCreateInput): Promise<Voucher> {
    return this.prisma.voucher.create({ data });
  }

  async getVouchers(): Promise<Voucher[]> {
    return this.prisma.voucher.findMany();
  }

  async getVoucher(id: number): Promise<Voucher> {
    return this.prisma.voucher.findUnique({ where: { id } });
  }

  async updateVoucher(
    id: number,
    data: Prisma.VoucherUpdateInput,
  ): Promise<Voucher> {
    return this.prisma.voucher.update({
      where: { id },
      data,
    });
  }

  async deleteVoucher(id: number): Promise<Voucher> {
    return this.prisma.voucher.delete({
      where: { id },
    });
  }

  async checkAndUpdateStatusExpired() {
    const now = new Date();
    await this.prisma.voucher.updateMany({
      where: {
        expiresAt: { lt: now },
        status: 'active',
      },
      data: { status: 'expired' },
    });
  }

  async useVoucher(id: number) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
    });
    if (!voucher) {
      throw new Error(`Voucher with ID ${id} not found.`);
    }
    if (voucher.status === 'used') {
      return null;
    }
    return this.prisma.voucher.update({
      where: { id },
      data: { status: 'used' },
    });
  }

  async getVouchersByIds(voucherIds: number[]) {
    console.log('get');
    return this.prisma.voucher.findMany({
      where: { id: { in: voucherIds } },
      select: {
        id: true,
        status: true,
        code: true,
        expiresAt: true,
      },
    });
  }
}
