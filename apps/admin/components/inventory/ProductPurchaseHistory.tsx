import React, { useEffect, useState } from 'react';
import { Purchase, api, formatDate, formatCurrencyChilean } from '@artifact/core';
import { ShoppingCart, Calendar, Tag, Info, Activity } from 'lucide-react';
import { Typography, Chip } from "@material-tailwind/react";

interface ProductPurchaseHistoryProps {
  productId: string;
}

const ProductPurchaseHistory: React.FC<ProductPurchaseHistoryProps> = ({
  productId,
}) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchPurchaseHistory = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/products/${productId}/purchases`);
        console.log('Historial de compras recibido:', response.data);
        setPurchases(response.data);
      } catch (error) {
        console.error('Error fetching purchase history:', error);
        setPurchases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="ml-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Cargando historial...</span>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="p-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
        <Info className="w-6 h-6 text-slate-700 mx-auto mb-2" />
        <p className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>No hay movimientos registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-separate border-spacing-0'>
          <thead>
            <tr className="bg-white/[0.02]">
              <th className='px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/[0.05]'>
                <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Fecha</div>
              </th>
              <th className='px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/[0.05]'>
                <div className="flex items-center gap-2"><Activity className="w-3 h-3" /> Proveedor</div>
              </th>
              <th className='px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/[0.05] text-right'>
                Cantidad
              </th>
              <th className='px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/[0.05] text-right'>
                Costo Unit.
              </th>
              <th className='px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/[0.05] text-center'>
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => {
              const item = purchase.items?.find(
                (p) => p.productId === productId
              );
              if (!item) return null;

              return (
                <tr key={purchase.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className='px-4 py-3 border-b border-white/[0.03] text-xs font-mono text-slate-400'>
                    {formatDate(purchase.purchaseDate)}
                  </td>
                  <td className='px-4 py-3 border-b border-white/[0.03]'>
                    <Typography variant="small" color="white" className="font-bold text-xs" placeholder="" >
                      {purchase.company?.name || 'N/A'}
                    </Typography>
                  </td>
                  <td className='px-4 py-3 border-b border-white/[0.03] text-right text-xs font-black text-white'>
                    {item.quantity}
                  </td>
                  <td className='px-4 py-3 border-b border-white/[0.03] text-right text-xs font-bold text-emerald-400'>
                    {formatCurrencyChilean(item.unitPrice)}
                  </td>
                  <td className='px-4 py-3 border-b border-white/[0.03] text-center'>
                    <Chip
                      value={purchase.status}
                      size="sm"
                      variant="ghost"
                      color={purchase.status === 'COMPLETADA' ? 'green' : 'blue'}
                      className="rounded-full py-0.5 px-2 text-[10px] font-black uppercase tracking-widest"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPurchaseHistory;
