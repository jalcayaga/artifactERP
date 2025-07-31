
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Invoice, InvoiceStatus } from '@/lib/types';
import { formatCurrencyChilean } from '@/lib/utils';
import { InvoiceService } from '@/lib/services/invoiceService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EyeIcon, DocumentTextIcon } from '@/components/Icons';
import InvoiceDetailModal from './InvoiceDetailModal';

const InvoicesView: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = useCallback(async (page: number) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await InvoiceService.getAllInvoices(page);
      setInvoices(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(response.page);
    } catch (err) {
      setError('Error al cargar las facturas.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [fetchInvoices, currentPage]);

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  const handleCloseModal = () => {
    setViewingInvoice(null);
  };

  const handlePaymentSuccess = () => {
    handleCloseModal();
    fetchInvoices(currentPage);
  };

  if (loading) return <div>Cargando facturas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Gestión de Facturas</h1>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.client.name}</TableCell>
                    <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrencyChilean(invoice.grandTotal)}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                        <EyeIcon className="w-5 h-5" />
                      </Button>
                      {invoice.status !== InvoiceStatus.PAID && (
                        <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                          <DocumentTextIcon className="w-5 h-5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {viewingInvoice && (
        <InvoiceDetailModal
          invoice={viewingInvoice}
          onClose={handleCloseModal}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default InvoicesView;
