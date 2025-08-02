import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { DteService } from '../dte/dte.service';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let prismaService: PrismaService;
  let dteService: DteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: PrismaService,
          useValue: {
            // Mock your PrismaService methods here if needed
          },
        },
        {
          provide: DteService,
          useValue: {
            // Mock your DteService methods here if needed
          },
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    prismaService = module.get<PrismaService>(PrismaService);
    dteService = module.get<DteService>(DteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
