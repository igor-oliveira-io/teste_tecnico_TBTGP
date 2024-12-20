import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientService {
  private readonly voucherServiceUrl: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.voucherServiceUrl = this.configService.get<string>(
      'VOUCHER_SERVICE_URL',
    );
  }

  async createClient(data: { name: string; email: string }) {
    return this.prisma.client.create({ data });
  }

  async listClients() {
    return this.prisma.client.findMany();
  }

  async associateVoucher(clientId: number, voucherId: number) {
    const exists = await this.prisma.clientsVouchers.findUnique({
      where: { clientId_voucherId: { clientId, voucherId } },
    });

    if (exists) {
      throw new Error('Voucher already associated with this client.');
    }

    return this.prisma.clientsVouchers.create({
      data: { clientId, voucherId },
    });
  }

  async dissociateVoucher(clientId: number, voucherId: number) {
    return this.prisma.clientsVouchers.deleteMany({
      where: { clientId, voucherId },
    });
  }

  async getClientWithVouchers(clientId: number) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { vouchers: true },
    });

    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    const voucherIds = client.vouchers.map((voucher) => voucher.voucherId);

    try {
      const response = await axios.post(
        `${this.voucherServiceUrl}/vouchers/batch`,
        { voucherIds },
      );

      const voucherDetails = response.data;

      const clientWithVouchers = {
        id: client.id,
        name: client.name,
        email: client.email,
        vouchers: voucherDetails,
      };
      return clientWithVouchers;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch vouchers',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateClient(clientId: number, data: { name: string; email: string }) {
    const clientExists = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientExists) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.client.update({
      where: { id: clientId },
      data,
    });
  }

  async deleteClient(clientId: number) {
    const clientExists = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientExists) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.client.delete({
      where: { id: clientId },
    });
  }
}
