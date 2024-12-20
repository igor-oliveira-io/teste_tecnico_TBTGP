import { ApiProperty } from '@nestjs/swagger';

export class Voucher {
  @ApiProperty({ example: 'XYZ123', description: 'Voucher code' })
  code: string;

  @ApiProperty({ example: 'active', description: 'Voucher status' })
  status: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    description: 'Expiration date',
  })
  expiresAt: Date;
}
