import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PosService {
    constructor(private prisma: PrismaService) { }

    async createRegister(tenantId: string, name: string, code?: string) {
        if (code) {
            const existing = await this.prisma.cashRegister.findFirst({
                where: { tenantId, code },
            });
            if (existing) {
                throw new ConflictException('Cash register with this code already exists.');
            }
        }

        return this.prisma.cashRegister.create({
            data: {
                tenantId,
                name,
                code,
            },
        });
    }

    async getRegisters(tenantId: string) {
        return this.prisma.cashRegister.findMany({
            where: { tenantId },
            include: {
                shifts: {
                    where: { status: 'OPEN' },
                    take: 1
                }
            }
        });
    }

    async openShift(tenantId: string, registerId: string, userId: string, initialCash: number) {
        // Check if register exists and belongs to tenant
        const register = await this.prisma.cashRegister.findFirst({
            where: { id: registerId, tenantId }
        });
        if (!register) throw new NotFoundException('Cash register not found');

        // Check if already open
        const activeShift = await this.prisma.posShift.findFirst({
            where: { cashRegisterId: registerId, status: 'OPEN' }
        });

        if (activeShift) {
            throw new ConflictException('Register already has an active shift');
        }

        return this.prisma.posShift.create({
            data: {
                tenantId,
                cashRegisterId: registerId,
                userId,
                initialCash,
                startTime: new Date(),
                status: 'OPEN'
            }
        });
    }

    async closeShift(tenantId: string, shiftId: string, finalCash: number, notes?: string) {
        const shift = await this.prisma.posShift.findFirst({
            where: { id: shiftId, tenantId }
        });

        if (!shift) throw new NotFoundException('Shift not found');
        if (shift.status !== 'OPEN') throw new ConflictException('Shift is not open');

        return this.prisma.posShift.update({
            where: { id: shiftId },
            data: {
                endTime: new Date(),
                finalCash,
                status: 'CLOSED',
                notes
            }
        });
    }

    async getShiftSummary(tenantId: string, shiftId: string) {
        const shift = await this.prisma.posShift.findFirst({
            where: { id: shiftId, tenantId },
            include: {
                orders: {
                    select: {
                        grandTotalAmount: true,
                        paymentMethod: true,
                        status: true
                    }
                },
                user: {
                    select: { firstName: true, lastName: true, email: true }
                },
                cashRegister: true
            }
        });

        if (!shift) throw new NotFoundException('Shift not found');

        const totalSales = shift.orders
            .filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED') // Assuming COMPLETED/DELIVERED means paid/valid
            .reduce((sum, order) => sum + Number(order.grandTotalAmount), 0);

        // Breakdown by payment method could be added here

        return {
            ...shift,
            totalSales,
            orderCount: shift.orders.length
        };
    }
}
