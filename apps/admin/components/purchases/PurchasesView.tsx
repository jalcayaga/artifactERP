'use client';

import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Package,
  Truck,
  DollarSign,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import PurchaseForm from './PurchaseForm';
import { Card, CardContent, Button, DataTable } from '@artifact/ui';
import { Typography } from "@material-tailwind/react";

const PAGE_SIZE = 10;

const PurchasesView: React.FC = () => {
  const { activeCompany, isLoading: isCompanyLoading, error: companyError } = useCompany();
  const queryClient = useQueryClient();

  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCompany?.id]);

  const purchasesQuery = useQuery({
    queryKey: ['purchases', activeCompany?.id, currentPage],
    enabled: Boolean(activeCompany),
    placeholderData: (prev: any) => prev,
    queryFn: async ({ queryKey }) => {
      const [, , page] = queryKey;
      const response = await PurchaseService.getAllPurchases(page as number, PAGE_SIZE);
      return response;
    },
  });

  const purchases = purchasesQuery.data?.data ?? [];
  const totalPages = purchasesQuery.data?.pages ?? 1;
  const totalPurchases = purchasesQuery.data?.total ?? 0;

  const handleCreateNewPurchase = useCallback(() => {
    setShowPurchaseForm(true);
  }, []);

  const handleSavePurchase = useCallback(async () => {
    setShowPurchaseForm(false);
    await queryClient.invalidateQueries({ queryKey: ['purchases'] });
  }, [queryClient]);

  const handleCancelPurchaseForm = useCallback(() => {
    setShowPurchaseForm(false);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const columns = useMemo<ColumnDef<Purchase>[]>(() => {
    return [
      {
        id: 'purchaseId',
        header: 'ID Compra',
        accessorFn: (purchase) => purchase.id,
        cell: ({ row }) => (
          <span className='font-mono text-muted-foreground'>
            {row.original.id.substring(0, 8)}...
          </span>
        ),
      },
      {
        accessorKey: 'company',
        header: 'Proveedor',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Truck className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <div className='font-bold text-white text-sm'>
                {row.original.company?.name ?? 'Sin proveedor'}
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">RUT: {row.original.company?.taxId || 'N/A'}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'purchaseDate',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-blue-gray-200 opacity-80">
            {new Date(row.original.purchaseDate).toLocaleDateString('es-CL', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        ),
      },
      {
        accessorKey: 'grandTotal',
        header: 'Total',
        cell: ({ row }) => (
          <span className="text-white font-bold tracking-tight">
            {formatCurrencyChilean(Number(row.original.grandTotal))}
          </span>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    if (purchasesQuery.isError) {
      const error = purchasesQuery.error;
      const message =
        error instanceof Error ? error.message : 'Error al cargar las compras.';
      toast.error(message);
    }
  }, [purchasesQuery.isError, purchasesQuery.error]);

  if (purchasesQuery.isError) {
    const error = purchasesQuery.error;
    const message =
      error instanceof Error ? error.message : 'Error al cargar las compras.';
    return (
      <div className='p-8 text-center'>
        <Typography color="red" className="font-bold" placeholder=""  onResize={undefined} onResizeCapture={undefined}>
          {message}
        </Typography>
      </div>
    );
  }

  if (showPurchaseForm) {
    return <PurchaseForm onSave={handleSavePurchase} onCancel={handleCancelPurchaseForm} />;
  }

  return (
    <div className='space-y-6'>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Gestión de Compras</h1>
          <p className="text-slate-400 text-sm">Monitorea y registra las adquisiciones de productos y servicios.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          size="sm"
          onClick={handleCreateNewPurchase}
        >
          <Plus className="h-4 w-4" />
          Nueva Compra
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Compras Mes', value: formatCurrencyChilean(totalPurchases * 125000), icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Proveedores Activos', value: '12', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Presupuesto Restante', value: '$12.5M', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-white/[0.05] bg-[#1e293b]/40 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/[0.05] bg-[#1e293b]/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar por proveedor..."
                className="pl-10 pr-4 py-2 bg-slate-900/50 border border-white/[0.05] rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-full md:w-64 transition-all"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white border border-white/[0.05]">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          <DataTable<Purchase>
            columns={columns}
            data={purchases}
            isLoading={purchasesQuery.isLoading}
            className="border-none"
            emptyState={
              <div className='text-center py-12 px-4'>
                <ShoppingCart className='mx-auto h-16 w-16 text-slate-600 opacity-20' />
                <h3 className="text-lg font-bold text-white mt-4">
                  No hay compras registradas
                </h3>
                <p className="text-slate-400 mt-2 max-w-xs mx-auto">
                  Comienza registrando una nueva compra para alimentar tu inventario.
                </p>
                <Button
                  onClick={handleCreateNewPurchase}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Registrar Primera Compra
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>

      {purchases.length > 0 && totalPages > 1 && (
        <div className='flex justify-between items-center px-4 py-2 bg-slate-900/30 border border-white/[0.05] rounded-lg'>
          <div>
            <p className='text-xs text-slate-400'>
              Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white font-bold">{totalPages}</span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || purchasesQuery.isFetching}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || purchasesQuery.isFetching}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesView;
