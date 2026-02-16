'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Typography,
  Button,
  IconButton,
  Card,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  AlertTriangle,
  X,
  PlusCircle,
  Building2,
  Package,
  TrendingDown,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { Company } from '@artifact/core';
import { SupplierService } from '@artifact/core/client';

interface StockInfo {
  productId: string;
  productName: string;
  quantityNeeded: number;
  quantityAvailable: number;
}

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string, quantity: number, supplierId: string) => void;
  stockInfo: StockInfo | null;
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  stockInfo,
}) => {
  const [suppliers, setSuppliers] = useState<Company[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      SupplierService.getAllSuppliers().then((data) => {
        setSuppliers(data as Company[]);
      });
    }
  }, [isOpen]);

  if (!isOpen || !stockInfo) {
    return null;
  }

  const handleConfirm = () => {
    if (!selectedSupplier) {
      toast.error('Debe seleccionar un proveedor para la reposición.');
      return;
    }
    const quantityToOrder = stockInfo.quantityNeeded - stockInfo.quantityAvailable;
    onConfirm(stockInfo.productId, quantityToOrder, selectedSupplier);
    onClose();
  };

  return (
    <Dialog onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
      open={isOpen}
      handler={onClose}
      size="xs"
      className="bg-transparent shadow-none"
      placeholder="" 
    >
      <Card className="bg-[#1a2537]/90 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl" placeholder="" >
        {/* Amber Alert Header */}
        <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-orange-600/20 to-transparent relative">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" color="white" className="font-black uppercase italic tracking-tighter leading-none" placeholder="" >
                Stock <span className="text-orange-500">Insuficiente</span>
              </Typography>
              <Typography variant="small" className="text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2" placeholder="" >
                <Package className="w-4 h-4 text-orange-500/50" /> Quiebre de inventario detectado
              </Typography>
            </div>
          </div>
          <IconButton variant="text" color="white" onClick={onClose} className="rounded-full bg-white/5 hover:bg-white/10" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
            <X className="w-6 h-6" />
          </IconButton>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
            <div className="flex flex-col text-center">
              <Typography variant="small" className="font-black uppercase tracking-[0.2em] text-slate-500 mb-2" placeholder="" >Producto</Typography>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight" placeholder="" >
                {stockInfo.productName}
              </Typography>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/10 text-center">
                <span className="block text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Necesario</span>
                <span className="text-xl font-black text-white italic">{stockInfo.quantityNeeded}</span>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/10 text-center">
                <span className="block text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Disponible</span>
                <span className="text-xl font-black text-white italic">{stockInfo.quantityAvailable}</span>
              </div>
            </div>

            <div className="pt-2">
              <Typography variant="small" className="text-slate-400 font-bold text-center leading-relaxed" placeholder="" >
                ¿Deseas generar una <span className="text-blue-500">Orden de Compra</span> de reposición inmediata para cubrir el faltante?
              </Typography>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seleccionar Proveedor</label>
              <Select
                label="Elegir Proveedor de Stock"
                value={selectedSupplier}
                onChange={(val) => setSelectedSupplier(val || '')}
                className="!border-white/10 !bg-white/5 text-white focus:!border-orange-500 rounded-xl h-12"
                labelProps={{ className: "hidden" }}
              >
                {suppliers.map((supplier) => (
                  <Option key={supplier.id} value={supplier.id} className="font-bold uppercase text-xs tracking-tight">
                    {supplier.name}
                  </Option>
                ))}
              </Select>
            </div>

            <Button
              variant="gradient"
              color="orange"
              fullWidth
              size="lg"
              disabled={!selectedSupplier}
              onClick={handleConfirm}
              className="flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs py-5 shadow-xl shadow-orange-500/20"
              placeholder=""  onResize={undefined} onResizeCapture={undefined}
            >
              <PlusCircle className="w-5 h-5" />
              Gatillar Reposición
            </Button>

            <Button
              variant="text"
              color="white"
              fullWidth
              onClick={onClose}
              className="rounded-2xl font-black uppercase tracking-widest text-[10px] py-4 opacity-50 hover:opacity-100 transition-opacity"
              placeholder=""  onResize={undefined} onResizeCapture={undefined}
            >
              Ignorar y Continuar
            </Button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-6 bg-black/20 flex items-center gap-3">
          <TrendingDown className="w-4 h-4 text-orange-500/50" />
          <Typography className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]" placeholder="" >
            Automatización de flujo de abastecimiento (Facto Logic)
          </Typography>
        </div>
      </Card>
    </Dialog>
  );
};

export default CreatePurchaseOrderModal;
