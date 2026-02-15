import { Test, TestingModule } from '@nestjs/testing';
import { DispatchesService } from './dispatches.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';

describe('DispatchesService', () => {
    let service: DispatchesService;
    let prismaService: PrismaService;

    const mockPrismaService: any = {
        dispatch: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        dispatchItem: {
            create: jest.fn(),
        },
        order: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        orderItemLot: {
            findMany: jest.fn(),
        },
        lot: {
            update: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };

    const mockProductsService = {
        // Add product service methods if needed used by DispatchesService
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DispatchesService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ProductsService, useValue: mockProductsService },
            ],
        }).compile();

        service = module.get<DispatchesService>(DispatchesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a dispatch and deduct stock from reserved lots', async () => {
            const tenantId = 'tenant-123';
            const createDispatchDto = {
                orderId: 'order-123',
                courierId: 'courier-123',
            };

            const mockOrder = {
                id: 'order-123',
                tenantId,
                user: { firstName: 'Juan', lastName: 'Perez' },
                company: { name: 'Acme Corp' },
                orderItems: [
                    { id: 'item-1', productId: 'prod-1', quantity: 2 },
                ],
            };

            const mockReservedLots = [
                { id: 'rel-1', orderItemId: 'item-1', lotId: 'lot-A', quantity: 2, quantityTaken: 2 },
            ];

            const mockDispatch = {
                id: 'dispatch-123',
                ...createDispatchDto,
                status: 'DRAFT',
            };

            mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
            mockPrismaService.dispatch.findFirst.mockResolvedValue(null); // No existing dispatch
            mockPrismaService.dispatch.create.mockResolvedValue(mockDispatch);
            mockPrismaService.orderItemLot.findMany.mockResolvedValue(mockReservedLots);

            // FIX: Argument order switched to match service signature: create(tenantId, dto)
            const result = await service.create(tenantId, createDispatchDto);

            expect(result).toEqual(mockDispatch);

            // Verify dispatch creation
            expect(mockPrismaService.dispatch.create).toHaveBeenCalled();

            // Verify DispatchItem creation
            expect(mockPrismaService.dispatchItem.create).toHaveBeenCalledWith({
                data: {
                    dispatchId: 'dispatch-123',
                    orderItemId: 'item-1',
                    quantity: 2,
                },
            });

            // KEY VERIFICATION: Stock Deduction
            // Should find reserved lots for the item
            expect(mockPrismaService.orderItemLot.findMany).toHaveBeenCalledWith({
                where: { orderItemId: 'item-1' }
            });

            // Should update the lot to decrement currentQuantity and committedQuantity
            expect(mockPrismaService.lot.update).toHaveBeenCalledWith({
                where: { id: 'lot-A' },
                data: {
                    currentQuantity: { decrement: 2 },
                    committedQuantity: { decrement: 2 },
                },
            });
        });

        it('should throw error if order not found', async () => {
            mockPrismaService.order.findUnique.mockResolvedValue(null);
            // FIX: Argument order switched
            await expect(service.create('tenant-1', { orderId: 'bad-id' })).rejects.toThrow();
        });
    });
});
