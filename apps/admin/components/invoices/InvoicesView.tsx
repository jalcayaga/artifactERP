'use client';

import React, { useMemo, useState } from 'react';
import { Invoice, InvoiceStatus, formatCurrencyChilean, UserRole } from '@artifact/core';
import { InvoiceService, PaymentService, useCompany, useAuth } from '@artifact/core/client';
import {
    Plus,
    Eye,
    CreditCard,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Share2,
    Search,
    Filter,
    ArrowUpRight,
    ChevronDown,
    TrendingUp,
    XCircle,
    Receipt,
    MoreVertical,
    Banknote,
    Calendar,
    Building2,
    ArrowRight
} from 'lucide-react';
import {
    Card,
    Typography,
    Button,
    IconButton,
    Input,
    Chip,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Tabs,
    TabsHeader,
    Tab
} from "@material-tailwind/react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import PaymentModal from './PaymentModal';
import { formatDate } from '@artifact/core';

const PAGE_SIZE = 10;
const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER];

const InvoicesView: React.FC = () => {
    const { activeCompany } = useCompany();
    const { isAuthenticated, currentUser, token } = useAuth();
    const queryClient = useQueryClient();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'Todas' | 'Pagadas' | 'Vencidas' | 'Pendientes' | 'Borrador'>('Todas');
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);

    const hasAccess = isAuthenticated && currentUser?.role && allowedRoles.includes(currentUser.role as UserRole);

    const invoicesQuery = useQuery({
        queryKey: ['invoices', activeCompany?.id, currentPage, statusFilter, token],
        enabled: Boolean(activeCompany && token && hasAccess),
        queryFn: async () => {
            const response = await InvoiceService.getAllInvoices(currentPage, PAGE_SIZE);
            return response;
        },
    });

    const invoices = invoicesQuery.data?.data ?? [];
    const totalPages = invoicesQuery.data?.pages ?? 1;

    const filteredInvoices = useMemo(() => {
        let result = invoices;
        if (searchTerm) {
            result = result.filter(inv =>
                inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        // Note: statusFilter filtering would typically happen on backend, but we can do a client-side layer here if needed.
        return result;
    }, [invoices, searchTerm]);

    const handleRegisterPayment = (invoice: Invoice) => {
        setInvoiceToPay(invoice);
        setShowPaymentModal(true);
    };

    const handleFactoring = async (invoice: Invoice) => {
        toast.info(`Iniciando proceso de factoring para factura ${invoice.invoiceNumber}`, {
            icon: <Share2 className="w-4 h-4 text-blue-500" />
        });
        setTimeout(() => {
            toast.success("Solicitud de Factoring enviada correctamente");
        }, 1500);
    };

    const getStatusBadge = (status: InvoiceStatus) => {
        const config = {
            [InvoiceStatus.PAID]: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2, label: 'Pagada' },
            [InvoiceStatus.PARTIALLY_PAID]: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock, label: 'Parcial' },
            [InvoiceStatus.SENT]: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: Share2, label: 'Enviada' },
            [InvoiceStatus.OVERDUE]: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertCircle, label: 'Vencida' },
            [InvoiceStatus.DRAFT]: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: Clock, label: 'Borrador' },
            [InvoiceStatus.VOID]: { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: XCircle, label: 'Anulada' },
        };
        const { color, icon: Icon, label } = config[status] || config[InvoiceStatus.DRAFT];
        return (
            <Chip
                value={label}
                size="sm"
                icon={<Icon className="w-3 h-3" />}
                className={`${color} text-[9px] font-black uppercase tracking-widest rounded-lg px-2 border`}
                
            />
        );
    };

    if (!activeCompany) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
                    <Building2 className="w-12 h-12 text-slate-500 opacity-20" />
                </div>
                <Typography variant="h4" color="white" className="font-black uppercase tracking-tighter italic" placeholder="" >
                    Selecciona una <span className="text-blue-500">Empresa</span>
                </Typography>
                <Typography className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2" placeholder="" >
                    Debes seleccionar una organización para gestionar sus facturas.
                </Typography>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Receipt className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
                            Gestión de <span className="text-blue-500">Facturación</span>
                        </Typography>
                        <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2" placeholder="" >
                            <TrendingUp className="w-4 h-4 text-blue-500/50" /> Control financiero y cobranzas avanzadas
                        </Typography>
                    </div>
                </div>

                <Button
                    variant="gradient"
                    color="blue"
                    size="lg"
                    className="flex items-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs group py-4 px-8 shadow-xl shadow-blue-500/20"
                    placeholder=""  onResize={undefined} onResizeCapture={undefined}
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Nueva Factura
                </Button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Monto Vencido', value: '$2,050,000', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                    { label: 'Facturas Pendientes', value: '$4,600,000', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                    { label: 'Recaudación Mes', value: '$12,450,000', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Días de Pago Prom.', value: '7 Días', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                ].map((stat, i) => (
                    <Card key={i} className={`bg-[#1a2537]/40 backdrop-blur-3xl border ${stat.border} p-6 rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all duration-300`} placeholder="" >
                        <div className="flex flex-col gap-4">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <Typography variant="small" className="text-slate-500 font-black uppercase tracking-widest text-[10px]" placeholder="" >
                                    {stat.label}
                                </Typography>
                                <Typography variant="h4" color="white" className="font-black italic tracking-tighter mt-1" placeholder="" >
                                    {stat.value}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Table Container */}
            <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" placeholder="" >
                {/* Table Header / Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="BUSCAR POR FOLIO O EMPRESA..."
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 px-10 text-xs font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="text" color="white" className="flex items-center gap-2 rounded-xl bg-white/5 px-4 font-black uppercase tracking-widest text-[10px]" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                            <Filter className="w-4 h-4 text-blue-500" />
                            Filtros
                        </Button>
                    </div>

                    <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                        {['Todas', 'Pagadas', 'Vencidas', 'Pendientes', 'Borrador'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab as any)}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === tab
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* High Density Table Body */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01]">
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Folio / Emisión</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Empresa / Cliente</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Estado</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Total</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                <Receipt className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black italic text-white group-hover:text-blue-400 transition-colors uppercase tracking-widest">#{inv.invoiceNumber}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Calendar className="w-3 h-3 text-slate-600" />
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{formatDate(inv.issueDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-200 uppercase tracking-tight italic">
                                                {inv.company?.name || 'Empresa No Registrada'}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Building2 className="w-3 h-3 text-slate-600" />
                                                <span className="text-[10px] text-slate-500 font-bold tracking-widest">{inv.company?.taxId || 'RUT NO DISPONIBLE'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center">
                                            {getStatusBadge(inv.status)}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-md font-black italic text-white group-hover:scale-110 transition-transform origin-right">{formatCurrencyChilean(inv.grandTotal)}</span>
                                            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Pesos Chilenos</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <IconButton variant="text" color="blue" className="rounded-xl bg-blue-500/5 hover:bg-blue-500/15" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                                                <Eye className="w-4 h-4 text-blue-400" />
                                            </IconButton>
                                            {inv.status !== InvoiceStatus.PAID && (
                                                <IconButton variant="text" color="emerald" onClick={() => handleRegisterPayment(inv)} className="rounded-xl bg-emerald-500/5 hover:bg-emerald-500/15" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                                                    <Banknote className="w-4 h-4 text-emerald-400" />
                                                </IconButton>
                                            )}
                                            <IconButton variant="text" color="blue" onClick={() => handleFactoring(inv)} className="rounded-xl bg-blue-500/5 hover:bg-blue-500/15" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                                                <Share2 className="w-4 h-4 text-blue-400" />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {invoicesQuery.isLoading && (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center border-none">
                                        <div className="flex flex-col items-center gap-4 animate-pulse">
                                            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <Typography className="text-slate-500 font-black uppercase tracking-widest text-xs" placeholder="" >
                                                Sincronizando flujos de caja...
                                            </Typography>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 bg-white/5 w-fit mx-auto p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <IconButton
                        size="sm"
                        variant="text"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        color="white"
                        className="rounded-xl hover:bg-white/10"
                        placeholder=""  onResize={undefined} onResizeCapture={undefined}
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                    </IconButton>
                    <Typography color="white" className="font-black text-xs uppercase tracking-widest px-4" placeholder="" >
                        Lote <span className="text-blue-500 px-2">{currentPage}</span> / <span className="text-slate-500 px-2">{totalPages}</span>
                    </Typography>
                    <IconButton
                        size="sm"
                        variant="text"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        color="white"
                        className="rounded-xl hover:bg-white/10"
                        placeholder=""  onResize={undefined} onResizeCapture={undefined}
                    >
                        <ArrowRight className="w-4 h-4" />
                    </IconButton>
                </div>
            )}

            {/* Modals */}
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
