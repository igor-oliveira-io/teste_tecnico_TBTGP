import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Voucher } from './entities/voucher.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Vouchers') // This groups the routes under the "Vouchers" category in Swagger UI
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new voucher' })
  @ApiBody({
    description: 'Information required to create a voucher',
    type: Voucher,
  })
  @ApiResponse({
    status: 201,
    description: 'Voucher created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error creating voucher.',
  })
  create(@Body() data: Prisma.VoucherCreateInput) {
    return this.voucherService.createVoucher(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all vouchers' })
  @ApiResponse({
    status: 200,
    description: 'List of vouchers.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error listing vouchers.',
  })
  findAll() {
    return this.voucherService.getVouchers();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a voucher by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Voucher ID',
  })
  @ApiBody({
    description: 'Data to update the voucher',
    type: Voucher,
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error updating voucher.',
  })
  update(@Param('id') id: string, @Body() data: Prisma.VoucherUpdateInput) {
    return this.voucherService.updateVoucher(Number(id), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a voucher by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Voucher ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error deleting voucher.',
  })
  remove(@Param('id') id: string) {
    return this.voucherService.deleteVoucher(Number(id));
  }

  @Get('expire-vouchers')
  @ApiOperation({ summary: 'Update the status of expired vouchers' })
  @ApiResponse({
    status: 200,
    description: 'Expired vouchers updated successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error updating expired vouchers.',
  })
  async expireVouchers() {
    await this.voucherService.checkAndUpdateStatusExpired();
    return { message: 'Expired vouchers updated successfully.' };
  }

  @Get(':id/use')
  @ApiOperation({ summary: 'Use a voucher by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Voucher ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher used successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error using voucher.',
  })
  async useVoucher(@Param('id') id: string) {
    if (isNaN(Number(id))) {
      throw new BadRequestException('Invalid voucher ID');
    }

    const voucher = await this.voucherService.useVoucher(Number(id));
    if (voucher === null) {
      return { message: `Voucher ${voucher.code} has already been used.` };
    }

    return { message: `Voucher ${voucher.code} used successfully!` };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a voucher by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Voucher ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Voucher not found.',
  })
  findOne(@Param('id') id: string) {
    return this.voucherService.getVoucher(Number(id));
  }

  @Post('batch')
  @ApiOperation({ summary: 'Get multiple vouchers by IDs' })
  @ApiBody({
    description: 'List of voucher IDs',
    type: [Number],
    examples: {
      example1: {
        value: { voucherIds: [2, 3, 4] },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Voucher details.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error getting multiple vouchers.',
  })
  async getVouchersBatch(@Body('voucherIds') voucherIds: number[]) {
    if (!voucherIds || !Array.isArray(voucherIds)) {
      return { error: 'voucherIds must be an array of numbers.' };
    }
    return this.voucherService.getVouchersByIds(voucherIds);
  }
}
