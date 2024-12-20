import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from './voucher.service';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

describe('VoucherService', () => {
  let service: VoucherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        {
          provide: PrismaService,
          useValue: {
            voucher: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
