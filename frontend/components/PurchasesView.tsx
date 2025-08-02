import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import PurchaseForm from '@/components/PurchaseForm';
import { PlusIcon, ShoppingCartIcon } from '@/components/Icons';
import { Purchase, UserRole, Company } from '@/lib/types';
import { formatCurrencyChilean } from '@/lib/utils';
import { PurchaseService } from '@/lib/services/purchaseService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const PurchasesView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [showPurchaseForm, setShowPurchaseForm] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPurchases, setTotalPurchases] = useState(0);

  const fetchPurchases = useCallback(async (page: number = 1) => {
    if (!isAuthenticated || (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR)) {
      setError('No autorizado para ver esta página o no autenticado.');
      setLoading(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
      return;
    }
    setLoading(true);
    try {
      const response = await PurchaseService.getAllPurchases(page);
      setPurchases(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalPurchases(response.total);
    } catch (err: any) {
      console.error('Error fetching purchases:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al cargar las compras.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, router]);

  useEffect(() => {
    if (!authLoading) {
      fetchPurchases(currentPage);
    }
  }, [fetchPurchases, currentPage, authLoading]);

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

  if (authLoading) {
    return <div className="text-center py-8">Cargando autenticación...</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Cargando compras...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR)) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos suficientes.</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Gestión de Compras
          </h1>
          <Button
            className="w-full sm:w-auto"
            onClick={handleCreateNewPurchase}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span>Registrar Nueva Compra</span>
          </Button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {purchases.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>ID Compra</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id} className="hover:bg-accent transition-colors duration-150">
                        <TableCell className="font-mono text-muted-foreground">{purchase.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{purchase.company?.name}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold text-primary text-right">{formatCurrencyChilean(purchase.grandTotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <ShoppingCartIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  No hay compras registradas
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Comienza registrando una nueva compra para verla listada aquí.
                </p>
                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleCreateNewPurchase}
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Registrar Primera Compra</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} (Total: {totalPurchases} compras)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchasesView;
