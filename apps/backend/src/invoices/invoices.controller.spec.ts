import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let invoicesService: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            // Mock your InvoicesService methods here if needed
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    invoicesService = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
