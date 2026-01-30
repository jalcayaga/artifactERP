import React, { useState, useCallback, useEffect } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { InvoiceService } from '@/lib/services/invoiceService';
import { Invoice, InvoiceStatus } from '@/lib/types';
import { formatCurrencyChilean } from '@/lib/utils';
import { EyeIcon, DocumentTextIcon } from '@/components/Icons';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import InvoiceDetailModal from './InvoiceDetailModal';

const InvoicesView: React.FC = () => {
  const { activeCompany, isLoading: isCompanyLoading, error: companyError } = useCompany();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = useCallback(async (page: number) => {
    if (!activeCompany) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await InvoiceService.getAllInvoices(page, 10, { companyId: activeCompany.id });
      setInvoices(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(response.page);
      setError(null);
    } catch (err) {
      setError('Error al cargar las facturas.');
    } finally {
      setLoading(false);
    }
  }, [activeCompany]);

  useEffect(() => {
    if (!isCompanyLoading && activeCompany) {
      fetchInvoices(currentPage);
    }
  }, [fetchInvoices, currentPage, isCompanyLoading, activeCompany]);

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

  if (isCompanyLoading) {
    return <div className="text-center py-8">Cargando datos de la empresa...</div>;
  }

  if (companyError) {
    return <div className="text-center py-8 text-destructive">{companyError}</div>;
  }

  if (!activeCompany) {
    return <div className="text-center py-8">Por favor, selecciona una empresa para ver sus facturas.</div>;
  }
  
  if (loading) return <div>Cargando facturas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className='space-y-6 lg:space-y-8'>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Facturas</h1>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Factura</TableHead>
                  <TableHead>Empresa</TableHead>
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
                    <TableCell>{invoice.company?.name}</TableCell>
                    <TableCell>
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatCurrencyChilean(invoice.grandTotal)}
                    </TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <EyeIcon className='w-5 h-5' />
                      </Button>
                      {invoice.status !== InvoiceStatus.PAID && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <DocumentTextIcon className='w-5 h-5' />
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