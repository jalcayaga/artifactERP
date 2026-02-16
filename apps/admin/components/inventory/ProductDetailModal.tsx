import React, { useEffect, useState } from 'react';
import { Product, Lot, formatCurrencyChilean, api, cn, formatDate } from '@artifact/core';
import {
  X,
  Package,
  Archive,
  Tag,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Calendar,
  Layers,
  Pencil,
  FileText,
  TrendingUp,
  Boxes,
  Info
} from 'lucide-react';
import {
  Button,
  IconButton,
  Typography,
  Chip
} from "@material-tailwind/react";
import LotEditModal from './LotEditModal';
import ProductPurchaseHistory from './ProductPurchaseHistory';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const DetailItem: React.FC<{
  label: string;
  value?: string | number | boolean | React.ReactNode;
  icon?: React.FC<{ className?: string }>;
  isCurrency?: boolean;
}> = ({ label, value, icon: Icon, isCurrency = false }) => {
  let displayValue: React.ReactNode;

  if (isCurrency && typeof value === 'number') {
    displayValue = <span className="text-white font-black italic">{formatCurrencyChilean(value)}</span>;
  } else if (typeof value === 'boolean') {
    displayValue = value ? (
      <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
        <CheckCircle2 className="h-3 w-3" /> Sí
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest">
        <AlertCircle className="h-3 w-3" /> No
      </div>
    );
  } else if (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    displayValue = <span className='italic text-slate-600 font-bold text-[10px] uppercase tracking-widest'>No especificado</span>;
  } else {
    displayValue = <span className="text-slate-300 font-bold text-sm leading-tight tracking-tight">{value}</span>;
  }

  return (
    <div className='flex flex-col sm:flex-row sm:items-center py-4 border-b border-white/[0.03] last:border-0 group'>
      <dt className='w-full sm:w-1/3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center group-hover:text-slate-400 transition-colors'>
        {Icon && <Icon className='w-3.5 h-3.5 mr-3 text-blue-500/30 group-hover:text-blue-500 group-hover:scale-110 transition-all' />}
        {label}
      </dt>
      <dd className='w-full sm:w-2/3 mt-2 sm:mt-0'>
        {displayValue}
      </dd>
    </div>
  );
};

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLoadingLots, setIsLoadingLots] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);

  const handleSaveLot = (updatedLot: Lot) => {
    setLots((prevLots) =>
      prevLots.map((l) => (l.id === updatedLot.id ? updatedLot : l))
    );
  };

  useEffect(() => {
    if (product && product.productType === 'PRODUCT') {
      const fetchLots = async () => {
        setIsLoadingLots(true);
        try {
          const response = await api.get(`/products/${product.id}/lots`);
          setLots(response.data);
        } catch (error) {
          console.error(`Error fetching lots for product ${product.id}:`, error);
          setLots([]);
        } finally {
          setIsLoadingLots(false);
        }
      };
      fetchLots();
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-all'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
    >
      <div
        className='bg-[#1e293b]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-6 bg-white/[0.02] border-b border-white/[0.05]'>
          <div className='flex items-center gap-5'>
            <div className="relative group">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-white/5 transition-transform group-hover:scale-105'
                />
              ) : (
                <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center ring-2 ring-white/5'>
                  <Package className='w-8 h-8 sm:w-10 sm:h-10 text-slate-500' />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 rounded-lg shadow-lg">
                {product.productType === 'PRODUCT' ? <Boxes className="w-3 h-3 text-white" /> : <Archive className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div>
              <Typography variant="h5" color="white" className="font-black uppercase italic tracking-tight leading-tight" placeholder="" >
                {product.name}
              </Typography>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  {product.sku || 'SIN SKU'}
                </span>
                <Chip
                  value={product.productType === 'PRODUCT' ? 'Producto' : 'Servicio'}
                  size="sm"
                  color={product.productType === 'PRODUCT' ? 'blue' : 'purple'}
                  className="rounded-full py-0 px-2 text-[9px] font-black uppercase tracking-widest"
                  placeholder="" 
                />
              </div>
            </div>
          </div>
          <IconButton
            variant="text"
            color="white"
            onClick={onClose}
            className="rounded-full bg-white/5 hover:bg-white/10"
            placeholder=""  onResize={undefined} onResizeCapture={undefined}
          >
            <X className='w-5 h-5' />
          </IconButton>
        </div>

        <div className='p-8 space-y-8 overflow-y-auto custom-scrollbar'>
          <section>
            <Typography variant="small" color="blue" className="font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2" placeholder="" >
              <Info className="w-4 h-4" /> Especificaciones Generales
            </Typography>
            <dl className='bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6'>
              <DetailItem label='Categoría' value={product.category} icon={Layers} />
              <DetailItem
                label='Descripción'
                value={product.description}
                icon={FileText}
              />
              <DetailItem
                label='Precio Venta'
                value={product.price}
                icon={TrendingUp}
                isCurrency={true}
              />
              {product.productType === 'PRODUCT' && product.unitPrice !== undefined && (
                <DetailItem
                  label='Precio Costo'
                  value={product.unitPrice}
                  icon={CreditCard}
                  isCurrency={true}
                />
              )}
              {product.productType === 'PRODUCT' && (
                <DetailItem
                  label='Stock Disponible'
                  value={`${product.totalStock} unidades`}
                  icon={Boxes}
                />
              )}
              <DetailItem label='Visibilidad POS' value={product.isPublished} icon={Package} />
              {product.technicalSheetUrl && (
                <DetailItem
                  label='Ficha Técnica'
                  icon={FileText}
                  value={
                    <Button
                      size="sm"
                      variant="gradient"
                      color="blue"
                      className="rounded-xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
                      onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}${product.technicalSheetUrl}`, '_blank')}
                      placeholder=""  onResize={undefined} onResizeCapture={undefined}
                    >
                      <FileText className="w-4 h-4" /> Descargar PDF
                    </Button>
                  }
                />
              )}
            </dl>
          </section>

          {product.productType === 'PRODUCT' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <Typography variant="small" color="blue" className="font-black uppercase tracking-[0.2em] flex items-center gap-2" placeholder="" >
                  <Archive className="w-4 h-4" /> Desglose de Lotes
                </Typography>
                <Chip
                  value={`${lots.length} Lotes`}
                  size="sm"
                  className="bg-slate-800 text-[10px] font-black uppercase tracking-widest rounded-md"
                  variant="ghost"
                  placeholder="" 
                />
              </div>

              {isLoadingLots ? (
                <div className="flex items-center justify-center p-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/5">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : lots.length > 0 ? (
                <div className='bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden'>
                  <ul className='divide-y divide-white/[0.03]'>
                    {lots.map((lot) => (
                      <li
                        key={lot.id}
                        className='p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4'
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-900 rounded-xl border border-white/5">
                            <Tag className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase tracking-tight">#{lot.lotNumber || 'SIN NUM'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lote de Stock</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs font-black text-white">{lot.currentQuantity}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unidades</p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-blue-400">{formatCurrencyChilean(lot.purchasePrice)}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Costo Uni.</p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-white">{lot.expirationDate ? formatDate(lot.expirationDate) : 'N/A'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Vencimiento</p>
                          </div>
                          <IconButton
                            size="sm"
                            variant="text"
                            color="blue"
                            className="bg-blue-500/5 hover:bg-blue-500/10"
                            onClick={() => setEditingLot(lot)}
                            placeholder=""  onResize={undefined} onResizeCapture={undefined}
                          >
                            <Pencil className='w-4 h-4' />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/5 text-center">
                  <Archive className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Sin lotes operativos</p>
                </div>
              )}
            </section>
          )}

          {product.productType === 'PRODUCT' && (
            <section className="space-y-4">
              <Typography variant="small" color="blue" className="font-black uppercase tracking-[0.2em] flex items-center gap-2" placeholder="" >
                <Calendar className="w-4 h-4" /> Historial de Movimientos
              </Typography>
              <div className='bg-white/[0.02] border border-white/[0.05] rounded-3xl p-2'>
                <ProductPurchaseHistory productId={product.id} />
              </div>
            </section>
          )}
        </div>

        <div className='p-6 bg-white/[0.02] border-t border-white/[0.05] flex justify-end gap-3'>
          <Button
            variant="text"
            color="white"
            onClick={onClose}
            className="font-black uppercase tracking-widest text-[10px]"
            placeholder=""  onResize={undefined} onResizeCapture={undefined}
          >
            Cerrar Detalle
          </Button>
        </div>
      </div>
      {editingLot && (
        <LotEditModal
          lot={editingLot}
          onClose={() => setEditingLot(null)}
          onSave={handleSaveLot}
        />
      )}
    </div>
  );
};

export default ProductDetailModal;
