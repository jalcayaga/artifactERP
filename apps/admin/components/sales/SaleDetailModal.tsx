'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Typography,
  Button,
  IconButton,
  Card,
  Chip,
  Select,
  Option
} from '@material-tailwind/react';
import {
  X,
  ShoppingCart,
  Building2,
  Calendar,
  Package,
  FileText,
  Truck,
  Receipt,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash
} from 'lucide-react';
import { formatDate, formatCurrencyChilean, OrderStatus } from '@artifact/core';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface SaleDetailModalProps {
  sale: any;
  onClose: () => void;
  onInvoiceCreated: () => void;
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ sale, onClose, onInvoiceCreated }) => {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isCreatingDispatch, setIsCreatingDispatch] = useState(false);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('');

  useEffect(() => {
    if (sale) {
      apiClient.get<any>('/couriers').then(res => {
        setCouriers(Array.isArray(res) ? res : (res as any).data || []);
      }).catch(err => console.error('Error loading couriers', err));
    }
  }, [sale]);

  const handleCreateDispatch = async () => {
    if (!sale) return;
    setIsCreatingDispatch(true);
    try {
      await apiClient.post('/dispatches', {
        orderId: sale.id,
        courierId: selectedCourierId || undefined,
      });
      toast.success('Guía de despacho creada exitosamente');
      onInvoiceCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error al crear la guía');
    } finally {
      setIsCreatingDispatch(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!sale) return;
    setIsCreatingInvoice(true);
    try {
      await apiClient.post('/invoices', {
        orderId: sale.id
      });
      toast.success('Factura creada exitosamente');
      onInvoiceCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error al crear la factura');
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      [OrderStatus.DELIVERED]: { color: 'bg-emerald-500/10 text-emerald-400', icon: CheckCircle2, label: 'Entregada' },
      [OrderStatus.PENDING]: { color: 'bg-orange-500/10 text-orange-400', icon: Clock, label: 'Pendiente' },
      [OrderStatus.CANCELLED]: { color: 'bg-red-500/10 text-red-400', icon: AlertCircle, label: 'Cancelada' },
    };
    const { color, icon: Icon, label } = config[status] || config[OrderStatus.PENDING];
    return (
      <Chip
        value={label}
        size="sm"
        icon={<Icon className="w-3 h-3" />}
        className={`${color} text-[9px] font-black uppercase tracking-widest rounded-lg px-2 border border-current/10`}
        
      />
    );
  };

  return (
    <Dialog onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
      open={!!sale}
      handler={onClose}
      size="lg"
      className="bg-transparent shadow-none"
      placeholder="" 
    >
      <Card className="bg-[#1a2537]/80 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" placeholder="" >
        {/* Glossy Header */}
        <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent relative">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
                Detalle de <span className="text-blue-500">Venta</span>
              </Typography>
              <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2" placeholder="" >
                <Hash className="w-4 h-4 text-blue-500/50" /> {sale?.id.substring(0, 12).toUpperCase()}
              </Typography>
            </div>
          </div>
          <IconButton variant="text" color="white" onClick={onClose} className="rounded-full bg-white/5 hover:bg-white/10" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
            <X className="w-6 h-6" />
          </IconButton>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Client Info */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <Typography variant="small" className="font-black uppercase tracking-widest text-slate-400" placeholder="" >
                    Información del Cliente
                  </Typography>
                </div>
                <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                  {sale?.company?.name || 'Venta General'}
                </Typography>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{sale?.company?.taxId}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{sale?.company?.email || 'SIN EMAIL'}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white/[0.02] rounded-[2rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Descripción</th>
                      <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Cant.</th>
                      <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total Neto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {sale?.orderItems?.map((item: any, idx: number) => (
                      <tr key={idx} className="group hover:bg-white/[0.01]">
                        <td className="p-4">
                          <span className="text-xs font-bold text-white uppercase italic tracking-tight">{item.product?.name}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xs font-black text-slate-400 italic">{item.quantity}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xs font-black text-white italic">{formatCurrencyChilean(item.totalPrice)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* General Highlights */}
            <div className="space-y-4">
              <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <Typography variant="small" className="font-black uppercase tracking-widest text-slate-500" placeholder="" >Estado Venta</Typography>
                  {getStatusBadge(sale?.status)}
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="small" className="font-black uppercase tracking-widest text-slate-500" placeholder="" >Registrado</Typography>
                  <Typography variant="small" color="white" className="font-bold" placeholder="" >{formatDate(sale?.createdAt)}</Typography>
                </div>
                <div className="h-px bg-white/5 my-2" />
                <div className="space-y-1">
                  <Typography variant="small" className="font-black uppercase tracking-widest text-slate-500" placeholder="" >Total Final</Typography>
                  <Typography variant="h3" color="white" className="font-black italic tracking-tighter" placeholder="" >
                    {formatCurrencyChilean(sale?.grandTotalAmount)}
                  </Typography>
                </div>
              </div>

              {/* DTE Workflows */}
              <div className="bg-blue-600/5 p-6 rounded-[2rem] border border-blue-600/10 space-y-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <Typography variant="small" className="font-black uppercase tracking-widest text-blue-500" placeholder="" >Documentación Tributaria</Typography>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seleccionar Courier</label>
                    <Select
                      label="Courier Opcional"
                      value={selectedCourierId}
                      onChange={(val) => setSelectedCourierId(val || '')}
                      className="!border-white/10 !bg-white/5 text-white focus:!border-blue-500 rounded-xl"
                      labelProps={{ className: "hidden" }}
                    >
                      <Option value="">Sin Courier (Despacho Propio)</Option>
                      {couriers.map(c => (
                        <Option key={c.id} value={c.id} className="font-bold uppercase text-[10px]">{c.name}</Option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="gradient"
                      color="blue"
                      fullWidth
                      onClick={handleCreateDispatch}
                      disabled={isCreatingDispatch}
                      className="flex items-center justify-center gap-3 rounded-xl font-black uppercase tracking-widest text-[10px] py-4"
                      placeholder=""  onResize={undefined} onResizeCapture={undefined}
                    >
                      <Truck className="w-4 h-4" />
                      {isCreatingDispatch ? 'Procesando...' : 'Emitir Guía'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="white"
                      fullWidth
                      onClick={handleCreateInvoice}
                      disabled={isCreatingInvoice}
                      className="flex items-center justify-center gap-3 rounded-xl font-black uppercase tracking-widest text-[10px] py-4 border-white/10"
                      placeholder=""  onResize={undefined} onResizeCapture={undefined}
                    >
                      <Receipt className="w-4 h-4 text-emerald-400" />
                      {isCreatingInvoice ? 'Generando...' : 'Generar Factura'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/[0.05] flex justify-end bg-black/20">
          <Button
            variant="text"
            color="white"
            onClick={onClose}
            className="rounded-2xl font-black uppercase tracking-widest text-xs px-10 py-4 opacity-50 hover:opacity-100 transition-opacity"
            placeholder=""  onResize={undefined} onResizeCapture={undefined}
          >
            Cerrar Detalle
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default SaleDetailModal;
