import fetchWithAuth from '../fetchWithAuth';
import { Payment, CreatePaymentDto } from '@/lib/types';

export const PaymentService = {
  async createPayment(paymentData: CreatePaymentDto): Promise<Payment> {
    return fetchWithAuth(`/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  async getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
    return fetchWithAuth(`/payments?invoiceId=${invoiceId}`);
  },
};