import React, { useState, useCallback, useEffect } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { PurchaseService } from '@/lib/services/purchaseService';
import { Purchase } from '@/lib/types';
import { formatCurrencyChilean } from '@/lib/utils';
import { PlusIcon, ShoppingCartIcon } from '@/components/Icons';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import PurchaseForm from './PurchaseForm';

const PurchasesView: React.FC = () => {
  const { activeCompany, isLoading: isCompanyLoading, error: companyError } = useCompany();
  const [showPurchaseForm, setShowPurchaseForm] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPurchases, setTotalPurchases] = useState(0);

  const fetchPurchases = useCallback(async (page: number = 1) => {
    if (!activeCompany) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await PurchaseService.getAllPurchases(page, 10);
      setPurchases(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalPurchases(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Error al cargar las compras.');
    } finally {
      setLoading(false);
    }
  }, [activeCompany]);

  useEffect(() => {
    if (!isCompanyLoading && activeCompany) {
      fetchPurchases(currentPage);
    }
  }, [fetchPurchases, currentPage, isCompanyLoading, activeCompany]);

  const handleCreateNewPurchase = useCallback(() => {
    setShowPurchaseForm(true);
  }, []);

  const handleSavePurchase = useCallback(async () => {
    setShowPurchaseForm(false);
    fetchPurchases(currentPage);
  }, [fetchPurchases, currentPage]);

  const handleCancelPurchaseForm = useCallback(() => {
    setShowPurchaseForm(false);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isCompanyLoading) {
    return <div className="text-center py-8">Cargando datos de la empresa...</div>;
  }

  if (companyError) {
    return <div className="text-center py-8 text-destructive">{companyError}</div>;
  }

  if (!activeCompany) {
    return <div className="text-center py-8">Por favor, selecciona una empresa para ver sus compras.</div>;
  }
  
  if (loading) {
    return <div className='text-center py-8'>Cargando compras...</div>
  }

  if (error) {
    return <div className='text-center py-8 text-destructive'>{error}</div>
  }

  return (
    <>
      <div className='space-y-6 lg:space-y-8'>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Compras</h1>
          <Button
            className='w-full sm:w-auto'
            onClick={handleCreateNewPurchase}
          >
            <PlusIcon className='w-5 h-5 mr-2' />
            <span>Registrar Nueva Compra</span>
          </Button>
        </div>

        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            {purchases.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader className='bg-muted/50'>
                    <TableRow>
                      <TableHead>ID Compra</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Fecha
                      </TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow
                        key={purchase.id}
                        className='hover:bg-accent transition-colors duration-150'
                      >
                        <TableCell className='font-mono text-muted-foreground'>
                          {purchase.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className='font-medium text-foreground'>
                            {purchase.company?.name}
                          </div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell text-muted-foreground'>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='font-semibold text-primary text-right'>
                          {formatCurrencyChilean(purchase.grandTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='text-center py-12 px-4'>
                <ShoppingCartIcon className='mx-auto h-16 w-16 text-muted-foreground opacity-40' />
                <h3 className='mt-3 text-xl font-semibold text-foreground'>
                  No hay compras registradas
                </h3>
                <p className='mt-1.5 text-sm text-muted-foreground'>
                  Comienza registrando una nueva compra para verla listada aquí.
                </p>
                <div className='mt-6'>
                  <Button type='button' onClick={handleCreateNewPurchase}>
                    <PlusIcon className='w-5 h-5 mr-2' />
                    <span>Registrar Primera Compra</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className='flex justify-between items-center mt-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Página {currentPage} de {totalPages} (Total: {totalPurchases}{' '}
              compras)
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </>
  )
};

export default PurchasesView;