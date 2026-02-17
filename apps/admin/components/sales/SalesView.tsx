'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Sale, OrderStatus, formatCurrencyChilean, UserRole } from '@artifact/core';
import { useCompany, SaleService, InvoiceService, useAuth, OrderService } from '@artifact/core/client';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  ShoppingCart,
  FileText,
  MoreVertical,
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Package,
  ArrowDownLeft,
  ChevronRight,
  Building2,
  Calendar,
  Receipt,
  LayoutGrid,
  List as ListIcon
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
import SaleForm from './SaleForm';
import SaleDetailModal from './SaleDetailModal';
import SalesWorkflowView from './SalesWorkflowView';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { TenantService } from '@/lib/services/tenant.service';
import { formatDate } from '@artifact/core';

const PAGE_SIZE = 10;
const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER];

const SalesView: React.FC = () => {
  const { activeCompany } = useCompany();
  const { isAuthenticated, currentUser, token } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [showSaleForm, setShowSaleForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'workflow'>('list');
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});

  const hasAccess = isAuthenticated && currentUser?.role && allowedRoles.includes(currentUser.role as UserRole);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCompany?.id]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await TenantService.getConfig();
        if (config.settings?.workflow?.customLabels) {
          setCustomLabels(config.settings.workflow.customLabels);
        }
      } catch (error) {
        console.error('Error fetching tenant config:', error);
      }
    };
    fetchConfig();
  }, []);

  const salesQuery = useQuery({
    queryKey: ['sales', activeCompany?.id, currentPage, token],
    enabled: Boolean(activeCompany && token && hasAccess),
    queryFn: async () => {
      const response = await SaleService.getAllSales(currentPage, PAGE_SIZE);
      return response;
    },
  });

  const sales = salesQuery.data?.data ?? [];
  const totalPages = salesQuery.data?.pages ?? 1;
  const totalSales = salesQuery.data?.total ?? 0;

  const deleteSaleMutation = useMutation({
    mutationFn: async (saleId: string) => {
      await SaleService.deleteSale(saleId);
    },
    onSuccess: () => {
      toast.success('Venta eliminada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al eliminar la venta.');
    },
    onSettled: () => {
      setSaleToDelete(null);
      setShowDeleteConfirmModal(false);
    },
  });

  const handleCreateNewSale = useCallback(() => {
    setEditingSale(null);
    setShowSaleForm(true);
  }, []);

  const handleEditSale = useCallback(async (sale: Sale) => {
    try {
      const detailedSale = await SaleService.getSaleById(sale.id);
      setEditingSale(detailedSale);
      setShowSaleForm(true);
    } catch (err) {
      toast.error('Error al cargar los detalles de la venta.');
    }
  }, []);

  const handleConfirmDeleteSale = async () => {
    if (saleToDelete) {
      deleteSaleMutation.mutate(saleToDelete.id);
    }
  };

  const handleViewSale = (sale: Sale) => {
    setViewingSale(sale);
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const invoice = await InvoiceService.createInvoiceFromOrder(orderId);
      toast.success(`Factura ${invoice.invoiceNumber} creada exitosamente.`, {
        icon: <Receipt className="w-4 h-4 text-emerald-500" />
      });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear la factura.');
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ saleId, newStatus }: { saleId: string, newStatus: OrderStatus }) => {
      return OrderService.updateOrderStatus(saleId, newStatus);
    },
    onSuccess: () => {
      toast.success('Estado actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al actualizar el estado');
    }
  });

  const handleUpdateStatus = (saleId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ saleId, newStatus });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      [OrderStatus.PENDING]: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: Clock, label: 'Pendiente' },
      [OrderStatus.CONFIRMED]: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: CheckCircle2, label: 'Confirmada' },
      [OrderStatus.PROCESSING]: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Package, label: 'Procesando' },
      [OrderStatus.SHIPPED]: { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: ArrowUpRight, label: 'Enviada' },
      [OrderStatus.DELIVERED]: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2, label: 'Entregada' },
      [OrderStatus.CANCELLED]: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle, label: 'Cancelada' },
    };
    const { color, icon: Icon, label } = config[status] || config[OrderStatus.PENDING];

    const displayLabel = customLabels[status] || label;

    return (
      <Chip
        value={displayLabel}
        size="sm"
        icon={React.createElement(Icon, { className: "w-3 h-3" })}
        className={`${color} text-[9px] font-black uppercase tracking-widest rounded-lg px-2 border`}
        placeholder=""
      />
    );
  };

  if (!activeCompany) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-700">
        <ShoppingCart className="w-16 h-16 text-slate-500 opacity-20 mb-6" />
        <Typography variant="h4" color="white" className="font-black uppercase tracking-tighter italic" placeholder="" >
          Actuar desde una <span className="text-blue-500">Organización</span>
        </Typography>
        <Typography className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2" placeholder="" >
          Selecciona una empresa para gestionar sus flujos de ventas.
        </Typography>
      </div>
    );
  }

  if (showSaleForm) {
    return (
      <SaleForm
        saleData={editingSale}
        onSave={() => {
          setShowSaleForm(false);
          setEditingSale(null);
          queryClient.invalidateQueries({ queryKey: ['sales'] });
        }}
        onCancel={() => setShowSaleForm(false)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <div>
            <Typography variant="h3" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
              Gestión de <span className="text-blue-500">Ventas</span>
            </Typography>
            <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2" placeholder="" >
              <TrendingUp className="w-4 h-4 text-blue-500/50" /> Pipeline de ingresos y flujo comercial
            </Typography>
          </div>
        </div>

        <Button
          variant="gradient"
          color="blue"
          size="lg"
          onClick={handleCreateNewSale}
          className="flex items-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs group py-4 px-8 shadow-xl shadow-blue-500/20"
          placeholder="" onResize={undefined} onResizeCapture={undefined}
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Nueva Venta
        </Button>
      </div>

      {/* High Density Listing Card */}
      <Card className="bg-[#1a2537]/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" placeholder="" >
        {/* Table Toolbar */}
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="BUSCAR VENTA POR EMPRESA O ID..."
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 px-10 text-xs font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 mr-2">
              <IconButton
                variant="text"
                size="sm"
                color={viewMode === 'list' ? 'blue' : 'white'}
                onClick={() => setViewMode('list')}
                className={`rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500/20 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                placeholder=""
              >
                <ListIcon className="w-4 h-4" />
              </IconButton>
              <IconButton
                variant="text"
                size="sm"
                color={viewMode === 'workflow' ? 'blue' : 'white'}
                onClick={() => setViewMode('workflow')}
                className={`rounded-lg transition-all ${viewMode === 'workflow' ? 'bg-blue-500/20 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                placeholder=""
              >
                <LayoutGrid className="w-4 h-4" />
              </IconButton>
            </div>
            <Button variant="text" color="white" className="flex items-center gap-2 rounded-xl bg-white/5 px-4 font-black uppercase tracking-widest text-[10px]" placeholder="" onResize={undefined} onResizeCapture={undefined}>
              <Filter className="w-4 h-4 text-blue-500" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Table/Workflow Body */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* ... table content remains the same ... */}
              <thead>
                <tr className="bg-white/[0.01]">
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ID Venta / Fecha</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Empresa / Cliente</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Estado</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Total Bruto</th>
                  <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {sales.map((sale) => (
                  <tr key={sale.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <ShoppingCart className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black italic text-white group-hover:text-blue-400 transition-colors uppercase tracking-widest">#{sale.id.substring(0, 8)}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-600" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{formatDate(sale.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-200 uppercase tracking-tight italic">
                          {sale.company?.name || 'Cliente No Registrado'}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-3 h-3 text-slate-600" />
                          <span className="text-[10px] text-slate-500 font-bold tracking-widest">{sale.company?.taxId || 'RUT NO DISPONIBLE'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(sale.status)}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-md font-black italic text-[#5d87ff]">{formatCurrencyChilean(sale.grandTotalAmount)}</span>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">IVA Inc.</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton variant="text" color="blue" onClick={() => handleViewSale(sale)} className="rounded-xl bg-blue-500/5 hover:bg-blue-500/15" placeholder="" onResize={undefined} onResizeCapture={undefined}>
                          <Eye className="w-4 h-4 text-blue-400" />
                        </IconButton>

                        <Menu placement="bottom-end">
                          <MenuHandler>
                            <IconButton variant="text" color="blue" className="rounded-xl bg-white/5 hover:bg-white/10" placeholder="" onResize={undefined} onResizeCapture={undefined}>
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="bg-[#1a2537] border-white/5 p-2 rounded-2xl min-w-[180px]" placeholder="" >
                            <MenuItem onClick={() => handleEditSale(sale)} className="flex items-center gap-3 py-3 rounded-xl hover:bg-white/5" placeholder="" >
                              <Edit2 className="w-4 h-4 text-orange-400" />
                              <span className="text-[10px] font-black uppercase text-white tracking-widest">Editar Venta</span>
                            </MenuItem>

                            {(sale.status === OrderStatus.DELIVERED || sale.status === OrderStatus.SHIPPED) && !sale.invoice && (
                              <MenuItem onClick={() => handleGenerateInvoice(sale.id)} className="flex items-center gap-3 py-3 rounded-xl hover:bg-white/5" placeholder="" >
                                <Receipt className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Generar Factura</span>
                              </MenuItem>
                            )}

                            <div className="h-px bg-white/5 my-1" />

                            <MenuItem
                              onClick={() => { setSaleToDelete(sale); setShowDeleteConfirmModal(true); }}
                              className="flex items-center gap-3 py-3 rounded-xl hover:bg-red-500/10"
                              placeholder=""
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                              <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">Eliminar Registro</span>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))}
                {salesQuery.isLoading && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center border-none">
                      <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <Typography className="text-slate-500 font-black uppercase tracking-widest text-xs" placeholder="" >
                          Sincronizando órdenes de venta...
                        </Typography>
                      </div>
                    </td>
                  </tr>
                )}
                {!salesQuery.isLoading && sales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center border-none">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <ShoppingCart className="w-16 h-16 text-slate-500" />
                        <Typography className="text-slate-500 font-black uppercase tracking-widest text-xs" placeholder="" >
                          No hay ventas registradas en este período.
                        </Typography>
                        <Button variant="text" color="blue" onClick={handleCreateNewSale} className="font-black uppercase tracking-widest text-[10px]" placeholder="" onResize={undefined} onResizeCapture={undefined}>
                          Crear Primera Venta
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <SalesWorkflowView
              sales={sales}
              onViewDetails={setViewingSale}
              onUpdateStatus={handleUpdateStatus}
              customLabels={customLabels}
            />
          </div>
        )}
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
            placeholder="" onResize={undefined} onResizeCapture={undefined}
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
            placeholder="" onResize={undefined} onResizeCapture={undefined}
          >
            <ChevronRight className="w-4 h-4" />
          </IconButton>
        </div>
      )}

      {/* Modals */}
      {viewingSale && (
        <SaleDetailModal
          sale={viewingSale}
          onClose={() => setViewingSale(null)}
          onInvoiceCreated={() => queryClient.invalidateQueries({ queryKey: ['sales'] })}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDeleteSale}
        title='Confirmar Eliminación'
        message={`¿Estás seguro de que deseas eliminar permanentemente esta venta? Los registros contables asociados podrían verse afectados.`}
        confirmText='Sí, eliminar registro'
      />
    </div>
  );
};

export default SalesView;
