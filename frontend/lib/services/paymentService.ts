
import fetchWithAuth from './api';
import { Payment, CreatePaymentDto } from '@/lib/types';

export const PaymentService = {
  async createPayment(paymentData: CreatePaymentDto): Promise<Payment> {
    return fetchWithAuth(`/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  async getPaymentsForInvoice(invoiceId: string): Promise<Payment[]> {
    return fetchWithAuth(`/payments?invoiceId=${invoiceId}`);
  },
};
