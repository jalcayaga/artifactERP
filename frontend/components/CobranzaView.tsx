import React, { useState, useEffect, useCallback } from 'react';
import { Invoice, UserRole, InvoiceStatus, Payment } from '@/lib/types';
import { InvoiceService } from '@/lib/services/invoiceService';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon } from '@/components/Icons';
import PaymentForm from './PaymentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyChilean } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CobranzaView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  const fetchInvoices = useCallback(async (page: number = 1, status: InvoiceStatus | 'all' = 'all') => {
    if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
      setError('No autorizado para ver esta página o no autenticado.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await InvoiceService.getAllInvoices(page, 10, status === 'all' ? undefined : status);
      setInvoices(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalInvoices(response.total);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError('Error al cargar las facturas.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchInvoices(currentPage, statusFilter);
    }
  }, [fetchInvoices, currentPage, authLoading, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOpenPaymentForm = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentFormOpen(true);
  };

  const handleClosePaymentForm = () => {
    setSelectedInvoice(null);
    setIsPaymentFormOpen(false);
  };

  const handlePaymentSaved = () => {
    handleClosePaymentForm();
    fetchInvoices(currentPage, statusFilter);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return <Badge variant="success">Pagada</Badge>;
      case InvoiceStatus.PARTIALLY_PAID:
        return <Badge variant="warning">Parcialmente Pagada</Badge>;
      case InvoiceStatus.OVERDUE:
        return <Badge variant="destructive">Vencida</Badge>;
      case InvoiceStatus.SENT:
        return <Badge variant="info">Enviada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateBalance = (invoice: Invoice) => {
    const totalPaid = invoice.payments?.reduce((acc, p) => acc + (p.amount as any), 0) || 0;
    return (invoice.grandTotal as any) - totalPaid;
  };

  if (authLoading) {
    return <div className="text-center py-8">Cargando autenticación...</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Cargando facturas...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Gestión de Cobranza
        </h1>
        <div className="w-full sm:w-auto">
          <Select onValueChange={(value) => setStatusFilter(value as InvoiceStatus | 'all')} defaultValue={statusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {Object.values(InvoiceStatus).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden border">
        <CardContent className="p-0">
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Nº Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Saldo Pendiente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-accent transition-colors duration-150">
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.company?.name}</TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{formatCurrencyChilean(invoice.grandTotal as any)}</TableCell>
                      <TableCell>{formatCurrencyChilean(calculateBalance(invoice))}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => handleOpenPaymentForm(invoice)}>
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Registrar Pago
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <h3 className="mt-3 text-xl font-semibold text-foreground">No hay facturas registradas</h3>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} (Total: {totalInvoices} facturas)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={isPaymentFormOpen} onOpenChange={setIsPaymentFormOpen}>
        <DialogContent aria-describedby="payment-form-description">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription id="payment-form-description">
              Ingrese los detalles del pago para la factura seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <PaymentForm
              invoice={selectedInvoice}
              onSave={handlePaymentSaved}
              onCancel={handleClosePaymentForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CobranzaView;