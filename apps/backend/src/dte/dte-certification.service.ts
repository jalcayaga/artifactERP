import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DteService } from './dte.service';

/**
 * MANDATORY TEST CASES BY SII (Set de Pruebas)
 * 1. Factura Electrónica (33) - Simple
 * 2. Factura Electrónica (33) - With Exempt Items
 * 3. Factura Electrónica (33) - With Global Discount
 * 4. Nota de Crédito (61) - Reference an invoice
 * 5. Nota de Débito (56) - Reference an invoice
 * 6. Factura Exenta (34)
 * 7. Boleta Electrónica (39)
 * 8. Boleta Exenta (41)
 */

@Injectable()
export class DteCertificationService {
    private readonly logger = new Logger(DteCertificationService.name);

    constructor(
        private prisma: PrismaService,
        private dteService: DteService
    ) { }

    async generateTestCase(tenantId: string, caseNumber: number) {
        this.logger.log(`Generating SII Test Case #${caseNumber} for tenant ${tenantId}`);

        switch (caseNumber) {
            case 1: return this.createSimpleInvoice(tenantId);
            case 2: return this.createInvoiceWithExempt(tenantId);
            case 3: return this.createInvoiceWithDiscount(tenantId);
            case 4: return this.createCreditNote(tenantId);
            case 5: return this.createDebitNote(tenantId);
            case 6: return this.createExemptInvoice(tenantId);
            case 7: return this.createSimpleReceipt(tenantId);
            case 8: return this.createExemptReceipt(tenantId);
            default:
                throw new Error(`Test Case #${caseNumber} not implemented`);
        }
    }

    private async createInvoiceWithExempt(tenantId: string) {
        const companyId = await this.getMockCompanyId(tenantId);
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `CERT-EX-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: 20000,
                vatAmount: 1900, // Only 10000 is taxable
                grandTotal: 21900,
                status: 'DRAFT',
                dteType: 33,
                companyId,
                items: {
                    create: [
                        { description: 'Item Afecto', quantity: 1, unitPrice: 10000, totalPrice: 10000 },
                        { description: 'Item Exento', quantity: 1, unitPrice: 10000, totalPrice: 10000, isExempt: true }
                    ]
                }
            }
        });
        return this.dteService.generateDte(tenantId, invoice.id);
    }

    private async createInvoiceWithDiscount(tenantId: string) {
        const companyId = await this.getMockCompanyId(tenantId);
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `CERT-DESC-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: 10000,
                discountAmount: 1000,
                vatAmount: 1710, // (10000 - 1000) * 0.19
                grandTotal: 10710,
                status: 'DRAFT',
                dteType: 33,
                companyId,
                items: {
                    create: [{ description: 'Item con Descuento', quantity: 1, unitPrice: 10000, totalPrice: 10000 }]
                }
            }
        });
        return this.dteService.generateDte(tenantId, invoice.id);
    }

    private async createDebitNote(tenantId: string) {
        const lastInvoice = await this.getLatestSentInvoice(tenantId);
        const dn = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `ND-CERT-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: 5000,
                vatAmount: 950,
                grandTotal: 5950,
                status: 'DRAFT',
                dteType: 56, // Nota de Débito
                companyId: lastInvoice.companyId,
                notes: `Ajuste débito a Factura ${lastInvoice.dteFolio}`,
                items: {
                    create: [{ description: 'Cargo adicional certificación', quantity: 1, unitPrice: 5000, totalPrice: 5000 }]
                }
            }
        });
        return this.dteService.generateDte(tenantId, dn.id);
    }

    private async createExemptInvoice(tenantId: string) {
        const companyId = await this.getMockCompanyId(tenantId);
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `CERT-34-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: 15000,
                vatAmount: 0,
                grandTotal: 15000,
                status: 'DRAFT',
                dteType: 34, // Factura Exenta
                companyId,
                items: {
                    create: [{ description: 'Servicio Exento', quantity: 1, unitPrice: 15000, totalPrice: 15000, isExempt: true }]
                }
            }
        });
        return this.dteService.generateDte(tenantId, invoice.id);
    }

    private async createSimpleReceipt(tenantId: string) {
        const companyId = await this.getMockCompanyId(tenantId);
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `BOL-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: 5000,
                vatAmount: 798, // 5000 is subtotal, VAT is included in grand total usually for boletas but here we follow standard
                grandTotal: 5000, // Typical boleta: grandTotal is key
                status: 'DRAFT',
                dteType: 39, // Boleta Electrónica
                companyId,
                items: {
                    create: [{ description: 'Venta Boleta', quantity: 1, unitPrice: 5000, totalPrice: 5000 }]
                }
            }
        });
        return this.dteService.generateDte(tenantId, invoice.id);
    }

    private async createExemptReceipt(tenantId: string) {
        const companyId = await this.getMockCompanyId(tenantId);
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `BOL-EX-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: 3000,
                vatAmount: 0,
                grandTotal: 3000,
                status: 'DRAFT',
                dteType: 41, // Boleta Exenta
                companyId,
                items: {
                    create: [{ description: 'Venta Exenta Boleta', quantity: 1, unitPrice: 3000, totalPrice: 3000, isExempt: true }]
                }
            }
        });
        return this.dteService.generateDte(tenantId, invoice.id);
    }

    private async getLatestSentInvoice(tenantId: string) {
        const inv = await this.prisma.invoice.findFirst({
            where: { tenantId, dteType: 33, dteStatus: { in: ['SENT', 'ACCEPTED'] } },
            orderBy: { createdAt: 'desc' }
        });
        if (!inv) throw new Error("Need a SENT/ACCEPTED invoice for this reference.");
        return inv;
    }

    private async createSimpleInvoice(tenantId: string) {
        // Create a standard invoice with specific values usually required by SII
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `CERT-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: 10000,
                vatAmount: 1900,
                grandTotal: 11900,
                status: 'DRAFT',
                dteType: 33,
                companyId: (await this.getMockCompanyId(tenantId)),
                items: {
                    create: [
                        {
                            description: 'Item de Prueba Certificación 1',
                            quantity: 1,
                            unitPrice: 10000,
                            totalPrice: 10000,
                        }
                    ]
                }
            }
        });

        return this.dteService.generateDte(tenantId, invoice.id);
    }

    private async createCreditNote(tenantId: string) {
        // Find a previously sent invoice to reference
        const lastInvoice = await this.prisma.invoice.findFirst({
            where: { tenantId, dteType: 33, dteStatus: { in: ['SENT', 'ACCEPTED'] } },
            orderBy: { createdAt: 'desc' }
        });

        if (!lastInvoice) throw new Error("Need a SENT/ACCEPTED invoice to create a credit note for certification.");

        const nc = await this.prisma.invoice.create({
            data: {
                tenantId,
                number: `NC-CERT-${Date.now()}`,
                issueDate: new Date(),
                dueDate: new Date(),
                subTotalAmount: lastInvoice.subTotalAmount,
                vatAmount: lastInvoice.vatAmount,
                grandTotal: lastInvoice.grandTotal,
                status: 'DRAFT',
                dteType: 61, // Nota de Crédito
                companyId: lastInvoice.companyId,
                notes: `Referencia a Factura ${lastInvoice.dteFolio}`,
                items: {
                    create: [
                        {
                            description: 'Anulación Factura de Prueba',
                            quantity: 1,
                            unitPrice: lastInvoice.subTotalAmount,
                            totalPrice: lastInvoice.subTotalAmount,
                        }
                    ]
                }
            }
        });

        return this.dteService.generateDte(tenantId, nc.id);
    }

    private async getMockCompanyId(tenantId: string) {
        const company = await this.prisma.company.findFirst({ where: { tenantId } });
        if (!company) {
            const user = await this.prisma.user.findFirst({ where: { tenantId } });
            if (!user) {
                throw new Error(`Cannot create mock company: User not found for tenant ${tenantId}`);
            }

            const newCompany = await this.prisma.company.create({
                data: {
                    tenantId: tenantId,
                    userId: user.id,
                    rut: '66666666-6',
                    name: 'SII Certification Client',
                    address: 'Teatinos 120, Santiago',
                    email: 'certificacion@sii.cl'
                }
            });
            return newCompany.id;
        }
        return company.id;
    }
}
