'use client';

import React, { useMemo, useState } from 'react';
import { Invoice, InvoiceStatus, formatCurrencyChilean,  } from '@artifact/core';;
import { InvoiceService, PaymentService, useCompany } from '@artifact/core/client';;
import {
    Card,
    CardContent,
    Button,
    DataTable,
} from '@artifact/ui';
import {
    Plus,
    Eye,
    CreditCard,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Share2
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import PaymentModal from './PaymentModal';

const PAGE_SIZE = 10;

const InvoicesView: React.FC = () => {
    const { activeCompany } = useCompany();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);

    const invoicesQuery = useQuery({
        queryKey: ['invoices', activeCompany?.id, currentPage],
        enabled: Boolean(activeCompany),
        queryFn: async () => {
            const response = await InvoiceService.getAllInvoices(currentPage, PAGE_SIZE);
            return response;
        },
    });

    const invoices = invoicesQuery.data?.data ?? [];
    const totalPages = invoicesQuery.data?.pages ?? 1;

    const handleRegisterPayment = (invoice: Invoice) => {
        setInvoiceToPay(invoice);
        setShowPaymentModal(true);
    };

    const handleFactoring = async (invoice: Invoice) => {
        // Skeleton for Factoring
        toast.info(`Iniciando proceso de factoring para factura ${invoice.invoiceNumber}`);
        setTimeout(() => {
            toast.success("Solicitud de Factoring enviada correctamente");
        }, 1500);
    };

    const columns = useMemo<ColumnDef<Invoice>[]>(() => [
        {
            accessorKey: 'invoiceNumber',
            header: 'Número',
            cell: ({ row }) => <span className="font-mono font-medium">{row.original.invoiceNumber}</span>,
        },
        {
            accessorKey: 'company.name',
            header: 'Cliente',
        },
        {
            accessorKey: 'issueDate',
            header: 'Emisión',
            cell: ({ row }) => new Date(row.original.issueDate).toLocaleDateString(),
        },
        {
            accessorKey: 'grandTotal',
            header: 'Total',
            cell: ({ row }) => (
                <span className="font-semibold">
                    {formatCurrencyChilean(row.original.grandTotal)}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) => {
                const status = row.original.status;
                const config = {
                    [InvoiceStatus.PAID]: { color: 'text-green-600 bg-green-50', icon: CheckCircle2, label: 'Pagada' },
                    [InvoiceStatus.PARTIALLY_PAID]: { color: 'text-blue-600 bg-blue-50', icon: Clock, label: 'Parcial' },
                    [InvoiceStatus.SENT]: { color: 'text-yellow-600 bg-yellow-50', icon: FileText, label: 'Enviada' },
                    [InvoiceStatus.OVERDUE]: { color: 'text-red-600 bg-red-50', icon: AlertCircle, label: 'Vencida' },
                    [InvoiceStatus.DRAFT]: { color: 'text-gray-600 bg-gray-50', icon: Clock, label: 'Borrador' },
                    [InvoiceStatus.VOID]: { color: 'text-gray-400 bg-gray-100', icon: AlertCircle, label: 'Anulada' },
                }[status] || { color: 'text-gray-600 bg-gray-50', icon: Clock, label: status };

                return (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <config.icon className="h-3 w-3" />
                        {config.label}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const invoice = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="Ver" onClick={() => setViewingInvoice(invoice)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status !== InvoiceStatus.PAID && (
                            <Button variant="ghost" size="sm" title="Registrar Pago" onClick={() => handleRegisterPayment(invoice)}>
                                <CreditCard className="h-4 w-4 text-green-600" />
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" title="Factoring" onClick={() => handleFactoring(invoice)}>
                            <Share2 className="h-4 w-4 text-blue-600" />
                        </Button>
                    </div>
                );
            },
        },
    ], []);

    if (!activeCompany) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Selecciona una empresa</h3>
                <p className="text-muted-foreground">Debes seleccionar una empresa para ver sus facturas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Facturación</h1>
                    <p className="text-muted-foreground">Administra tus facturas, cobranzas y factoring.</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={invoices}
                        filterColumn="invoiceNumber"
                        filterPlaceholder="Buscar factura..."
                    />
                </CardContent>
            </Card>

            {/* Pagination component would go here similar to SalesView */}

            {invoiceToPay && (
                <PaymentModal
                    invoice={invoiceToPay}
                    open={showPaymentModal}
                    onOpenChange={setShowPaymentModal}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['invoices'] });
                        setInvoiceToPay(null);
                    }}
                />
            )}
        </div>
    );
};

export default InvoicesView;
