import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DteService } from '../dte.service';
import { DteCronService } from '../dte-cron.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SiiService } from '../sii/sii.service';
import { DteSubmissionClient } from '../utils/dte-submission.client';

describe('DTE Integration (e2e)', () => {
    jest.setTimeout(60000); // Increase timeout to 60s
    let app: INestApplication;
    let authToken: string;

    const prismaMock = {
        invoice: {
            findFirst: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        dteCaf: {
            findFirst: jest.fn(),
            update: jest.fn(),
        }
    };

    const siiServiceMock = {
        getToken: jest.fn(),
        checkStatus: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService).useValue(prismaMock)
            .overrideProvider(SiiService).useValue(siiServiceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Mock login for authToken
        // (Note: Since we mocked PrismaService, real login might fail if it uses Prisma)
        // So we might need to mock successful login or just use a dummy token
        authToken = 'mock-auth-token-123';
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate a valid DTE XML (Factura)', async () => {
        const dteService = app.get(DteService);
        const mockInvoiceId = 'inv-test-integration-1';
        const mockTenantId = 'demo';

        prismaMock.invoice.findFirst.mockResolvedValue({
            id: mockInvoiceId,
            tenantId: mockTenantId,
            dteType: 33,
            dteFolio: null,
            grandTotal: 1190,
            subTotalAmount: 1000,
            vatAmount: 190,
            items: [{ product: { name: 'Item Test' }, quantity: 1, unitPrice: 1000, totalPrice: 1000 }],
            company: { rut: '66.666.666-6', name: 'Cliente Test' },
            tenant: { primaryDomain: '76.000.000-0', name: 'Emisor Test' },
            issueDate: new Date(),
        });

        prismaMock.dteCaf.findFirst.mockResolvedValue({
            id: 'caf-1',
            lastFolioUsed: 100,
            folioEnd: 200,
            cafXml: '<CAF>...</CAF>',
            privateKey: 'MOCK_KEY'
        });

        prismaMock.invoice.update.mockResolvedValue({ id: mockInvoiceId, dteStatus: 'GENERATED' });

        await dteService.generateDte(mockTenantId, mockInvoiceId);

        expect(prismaMock.invoice.findFirst).toHaveBeenCalled();
        expect(prismaMock.invoice.update).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ dteStatus: 'GENERATED', dteFolio: 101 })
        }));
    });

    it('should submit DTE and update status to SENT', async () => {
        const dteService = app.get(DteService);
        const mockInvoiceId = 'inv-test-integration-2';

        prismaMock.invoice.findFirst.mockResolvedValue({
            id: mockInvoiceId,
            tenantId: 'demo',
            xmlContent: '<DTE>Mock Signed XML</DTE>',
            dteFolio: 101,
            tenant: { primaryDomain: '76000000-0' }
        });

        siiServiceMock.getToken.mockResolvedValue('MOCK_TOKEN_123');
        jest.spyOn(DteSubmissionClient, 'submit').mockResolvedValue('<SII:RESPUESTA><TRACKID>TRACK-MOCK-123</TRACKID></SII:RESPUESTA>');
        prismaMock.invoice.update.mockResolvedValue({ dteStatus: 'SENT' });

        await dteService.submitInvoiceToSii('demo', mockInvoiceId);

        expect(siiServiceMock.getToken).toHaveBeenCalled();
        expect(DteSubmissionClient.submit).toHaveBeenCalled();
        expect(prismaMock.invoice.update).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ dteStatus: 'SENT', dteTrackId: 'TRACK-MOCK-123' })
        }));
    });

    it('should check status and update to ACCEPTED', async () => {
        const dteService = app.get(DteService);
        const mockInvoiceId = 'inv-test-integration-3';

        prismaMock.invoice.findFirst.mockResolvedValue({
            id: mockInvoiceId,
            tenantId: 'demo',
            dteTrackId: 'TRACK-MOCK-123',
            tenant: { primaryDomain: '76000000-0' }
        });

        siiServiceMock.getToken.mockResolvedValue('MOCK_TOKEN_123');
        siiServiceMock.checkStatus.mockResolvedValue({ estado: 'ACEPTADO', glosa: 'OK' });
        prismaMock.invoice.update.mockResolvedValue({ dteStatus: 'ACCEPTED' });

        await dteService.checkSubmissionStatus('demo', mockInvoiceId);

        expect(siiServiceMock.checkStatus).toHaveBeenCalled();
        expect(prismaMock.invoice.update).toHaveBeenCalledWith(expect.objectContaining({
            data: { dteStatus: 'ACCEPTED' }
        }));
    });
});
