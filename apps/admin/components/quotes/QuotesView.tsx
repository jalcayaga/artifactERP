'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quote, CreateQuoteDto, UpdateQuoteDto, UserRole, QuoteStatus, formatCurrencyChilean } from '@artifact/core';
import { useAuth, QuoteService } from '@artifact/core/client';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Printer,
  FileText,
  Hash,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  XCircle,
  AlertCircle
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
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import QuoteForm from './QuoteForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import DocumentPreview from '../common/DocumentPreview';
import { formatDate } from '@artifact/core';

const PAGE_SIZE = 10;
const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER];

const QuotesView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading, token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');

  const hasAccess =
    isAuthenticated &&
    currentUser?.role &&
    allowedRoles.includes(currentUser.role as UserRole);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const quotesQuery = useQuery({
    queryKey: ['quotes', statusFilter, currentPage, token],
    enabled: !!hasAccess && !!token,
    queryFn: async () => {
      const response = await QuoteService.getAllQuotes(
        currentPage,
        PAGE_SIZE,
        statusFilter === 'all' ? undefined : (statusFilter as QuoteStatus)
      );
      return response;
    },
  });

  const quotes = quotesQuery.data?.data ?? [];
  const totalPages = quotesQuery.data?.pages ?? 1;

  const filteredQuotes = useMemo(() => {
    if (!searchTerm) return quotes;
    return quotes.filter(q =>
      q.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotes, searchTerm]);

  const deleteQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      await QuoteService.deleteQuote(quoteId);
    },
    onSuccess: () => {
      toast.success('Cotización eliminada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al eliminar la cotización.');
    },
    onSettled: () => {
      setQuoteToDelete(null);
      setShowDeleteConfirmModal(false);
    },
  });

  const handleCreateNewQuote = () => {
    setEditingQuote(null);
    setShowQuoteForm(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setShowQuoteForm(true);
  };

  const handlePreviewQuote = (quote: Quote) => {
    setPreviewDoc({
      type: 'factura', // Quotes use a similar layout but labeled as Cotización
      folio: parseInt(quote.id.substring(0, 5), 16), // Mock folio from ID
      date: quote.quoteDate,
      receiver: quote.company?.name || 'Cliente',
      rut: quote.company?.taxId || '76.000.000-0',
      items: quote.items?.map(item => ({
        name: item.product?.name || 'Producto/Servicio',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.totalPrice
      })) || [],
      totals: {
        net: quote.subTotalAmount,
        iva: quote.vatAmount,
        total: quote.grandTotalAmount
      },
      title: 'COTIZACIÓN ELECTRÓNICA'
    });
  };

  const getStatusBadge = (status: QuoteStatus) => {
    const config = {
      [QuoteStatus.DRAFT]: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: Clock, label: 'Borrador' },
      [QuoteStatus.SENT]: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: ArrowUpRight, label: 'Enviada' },
      [QuoteStatus.ACCEPTED]: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2, label: 'Aceptada' },
      [QuoteStatus.REJECTED]: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle, label: 'Rechazada' },
      [QuoteStatus.INVOICED]: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: FileText, label: 'Facturada' },
      [QuoteStatus.EXPIRED]: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: AlertCircle, label: 'Expirada' },
    };
    const { color, icon: Icon, label } = config[status] || config[QuoteStatus.DRAFT];
    return (
      <Chip
        value={label}
        size="sm"
        icon={<Icon className="w-3 h-3" />}
        className={`${color} text-[9px] font-black uppercase tracking-widest rounded-lg px-2 border`}
        
      />
    );
  };

  if (showQuoteForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <QuoteForm
          quoteData={editingQuote}
          onSave={async (data) => {
            if (editingQuote) {
              await QuoteService.updateQuote(editingQuote.id, data as UpdateQuoteDto);
            } else {
              await QuoteService.createQuote(data as CreateQuoteDto);
            }
            toast.success('Cotización guardada correctamente.');
            setShowQuoteForm(false);
            queryClient.invalidateQueries({ queryKey: ['quotes'] });
          }}
          onCancel={() => setShowQuoteForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
              Gestión de <span className="text-blue-500">Cotizaciones</span>
            </Typography>
            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2" placeholder="" >
              <FileText className="w-4 h-4 text-blue-500/50" /> Ciclo de ventas y presupuestos comerciales
            </Typography>
          </div>
        </div>

        <Button
          variant="gradient"
          color="blue"
          size="lg"
          onClick={handleCreateNewQuote}
          className="flex items-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs group"
          placeholder=""  onResize={undefined} onResizeCapture={undefined}
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Nueva Cotización
        </Button>
      </div>

      {/* Glass Filtering Bar */}
      <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] p-2 rounded-[2rem] shadow-2xl" placeholder="" >
        <div className="flex flex-col md:flex-row items-center gap-4 p-1">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="BUSCAR POR EMPRESA, ID O PRODUCTO..."
              className="w-full bg-white/[0.03] border-0 rounded-[1.5rem] py-4 px-14 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Menu placement="bottom-end">
              <MenuHandler>
                <Button variant="text" color="white" className="flex items-center gap-2 rounded-xl bg-white/5 px-6 font-black uppercase tracking-widest text-[10px]" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                  <Filter className="w-4 h-4 text-blue-500" />
                  Estado: {statusFilter === 'all' ? 'Todos' : statusFilter}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </MenuHandler>
              <MenuList className="bg-[#1a2537] border-white/5 p-2 rounded-2xl min-w-[200px]" placeholder="" >
                <MenuItem onClick={() => setStatusFilter('all')} className="text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 rounded-xl py-3 px-4 flex items-center justify-between" placeholder="" >
                  Todas
                  {statusFilter === 'all' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                </MenuItem>
                {Object.values(QuoteStatus).map((status) => (
                  <MenuItem key={status} onClick={() => setStatusFilter(status)} className="text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 rounded-xl py-3 px-4 flex items-center justify-between" placeholder="" >
                    {status}
                    {statusFilter === status && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" placeholder="" >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ID / Fecha</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Empresa / RUT</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Estado</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Total</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Hash className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black italic text-white">{quote.id.substring(0, 8)}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{formatDate(quote.quoteDate)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">
                        {quote.company?.name || 'Empresa No Registrada'}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] text-slate-500 font-bold tracking-widest">{quote.company?.taxId || 'RUT/ID NO DISPONIBLE'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      {getStatusBadge(quote.status)}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-md font-black italic text-white">{formatCurrencyChilean(quote.grandTotalAmount)}</span>
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Bruto Incl. IVA</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton variant="text" color="blue" onClick={() => handlePreviewQuote(quote)} className="rounded-xl bg-blue-500/5 hover:bg-blue-500/15" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                        <Printer className="w-4 h-4 text-blue-500" />
                      </IconButton>
                      <IconButton variant="text" color="blue" onClick={() => handleEditQuote(quote)} className="rounded-xl bg-blue-500/5 hover:bg-blue-500/15" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </IconButton>
                      <IconButton variant="text" color="red" onClick={() => { setQuoteToDelete(quote); setShowDeleteConfirmModal(true); }} className="rounded-xl bg-red-500/5 hover:bg-red-500/15" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
              {quotesQuery.isLoading && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      <Typography className="text-slate-500 font-black uppercase tracking-widest text-xs" placeholder="" >
                        Sincronizando cotizaciones...
                      </Typography>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
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
            <ChevronRight className="w-4 h-4 rotate-180" />
          </IconButton>
          <Typography color="white" className="font-black text-xs uppercase tracking-widest px-4" placeholder="" >
            Página <span className="text-blue-500">{currentPage}</span> de <span className="text-slate-500">{totalPages}</span>
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
            <ChevronRight className="w-4 h-4" />
          </IconButton>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <DocumentPreview
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          document={previewDoc}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDeleteQuote}
        title='Anular Cotización'
        message={`¿Estás seguro de que deseas eliminar permanentemente esta cotización? Esta acción no se puede deshacer.`}
        confirmText='Sí, anular y eliminar'
      />
    </div>
  );
};

export default QuotesView;
