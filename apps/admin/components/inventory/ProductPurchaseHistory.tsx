import React, { useEffect, useState } from 'react';
import { Purchase, api, formatDate, formatCurrencyChilean } from '@artifact/core';
import { ShoppingCartIcon, TagIcon, CalendarIcon } from '@artifact/ui';

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
      <p className='text-sm text-muted-foreground'>
        Cargando historial de compras...
      </p>
    );
  }

  if (purchases.length === 0) {
    return (
      <p className='text-sm text-muted-foreground italic'>
        No hay historial de compras para este producto.
      </p>
    );
  }

  return (
    <div>
      <h3 className='text-md font-semibold text-foreground mb-3 flex items-center'>
        <ShoppingCartIcon className='w-5 h-5 mr-2 opacity-80' />
        Historial de Compras
      </h3>
      <div className='rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-border/50 text-sm'>
            <thead className='bg-muted/50'>
              <tr>
                <th
                  scope='col'
                  className='px-3 py-2 text-left font-medium text-muted-foreground'
                >
                  Fecha
                </th>
                <th
                  scope='col'
                  className='px-3 py-2 text-left font-medium text-muted-foreground'
                >
                  Proveedor
                </th>
                <th
                  scope='col'
                  className='px-3 py-2 text-left font-medium text-muted-foreground'
                >
                  Cantidad
                </th>
                <th
                  scope='col'
                  className='px-3 py-2 text-left font-medium text-muted-foreground'
                >
                  Precio Unit.
                </th>
                <th
                  scope='col'
                  className='px-3 py-2 text-left font-medium text-muted-foreground'
                >
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border bg-background'>
              {purchases.map((purchase) => {
                const item = purchase.items?.find(
                  (p) => p.productId === productId
                );
                if (!item) return null;

                return (
                  <tr key={purchase.id}>
                    <td className='px-3 py-2 whitespace-nowrap text-muted-foreground'>
                      {formatDate(purchase.purchaseDate)}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap font-medium text-foreground'>
                      {purchase.company?.name || 'N/A'}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap'>
                      {item.quantity}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap'>
                      {formatCurrencyChilean(item.unitPrice)}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap'>
                      <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPurchaseHistory;
