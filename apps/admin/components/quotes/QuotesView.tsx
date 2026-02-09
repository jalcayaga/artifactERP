import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quote, CreateQuoteDto, UpdateQuoteDto, UserRole, QuoteStatus, formatCurrencyChilean,  } from '@artifact/core';;
import {  } from '@artifact/core';
import { useAuth, QuoteService } from '@artifact/core/client';;
import {
  Card,
  CardContent,
  Button,
  DataTable,
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@artifact/ui';
import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import QuoteForm from './QuoteForm';
// import QuoteDetailModal from './QuoteDetailModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const PAGE_SIZE = 10;

const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER];

const QuotesView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>(QuoteStatus.SENT);

  const hasAccess =
    isAuthenticated &&
    currentUser?.role &&
    allowedRoles.includes(currentUser.role as UserRole);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const quotesQuery = useQuery({
    queryKey: ['quotes', statusFilter, currentPage],
    enabled: hasAccess,
    placeholderData: (prev: any) => prev,
    queryFn: async ({ queryKey }) => {
      const [, status, page] = queryKey;
      const response = await QuoteService.getAllQuotes(
        page as number,
        PAGE_SIZE,
        status === 'all' ? undefined : (status as QuoteStatus)
      );
      return response;
    },
  });

  useEffect(() => {
    if (quotesQuery.isError) {
      const error = quotesQuery.error;
      const message =
        error instanceof Error ? error.message : 'Error al cargar las cotizaciones.';
      toast.error(message);
    }
  }, [quotesQuery.isError, quotesQuery.error]);

  const deleteQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      await QuoteService.deleteQuote(quoteId);
    },
    onSuccess: () => {
      toast.success('Cotización eliminada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (error: any) => {
      console.error('Error deleting quote:', error);
      toast.error(error?.message || 'Error al eliminar la cotización.');
    },
    onSettled: () => {
      setQuoteToDelete(null);
      setShowDeleteConfirmModal(false);
      setViewingQuote((prev) => {
        if (prev && prev.id === quoteToDelete?.id) {
          return null;
        }
        return prev;
      });
    },
  });

  const handleCreateNewQuote = useCallback(() => {
    setEditingQuote(null);
    setShowQuoteForm(true);
  }, []);

  const handleEditQuote = useCallback((quote: Quote) => {
    setEditingQuote(quote);
    setShowQuoteForm(true);
  }, []);

  const handleDeleteQuoteRequest = useCallback((quote: Quote) => {
    setQuoteToDelete(quote);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDeleteQuote = useCallback(() => {
    if (quoteToDelete) {
      deleteQuoteMutation.mutate(quoteToDelete.id);
    }
  }, [deleteQuoteMutation, quoteToDelete]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setQuoteToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleSaveQuote = useCallback(
    async (quoteData: CreateQuoteDto | UpdateQuoteDto) => {
      try {
        if (editingQuote) {
          await QuoteService.updateQuote(editingQuote.id, quoteData as UpdateQuoteDto);
          toast.success('Cotización actualizada correctamente.');
        } else {
          await QuoteService.createQuote(quoteData as CreateQuoteDto);
          toast.success('Cotización creada correctamente.');
        }
        setShowQuoteForm(false);
        setEditingQuote(null);
        await queryClient.invalidateQueries({ queryKey: ['quotes'] });
      } catch (error: any) {
        console.error('Error saving quote:', error);
        if (error?.message?.includes('Unauthorized')) {
          router.push('/login');
        } else {
          toast.error(error?.message || 'Error al guardar la cotización.');
        }
        throw error;
      }
    },
    [editingQuote, queryClient, router]
  );

  const handleCloseForm = useCallback(() => {
    setShowQuoteForm(false);
    setEditingQuote(null);
  }, []);

  const handleViewQuote = useCallback((quote: Quote) => {
    setViewingQuote(quote);
  }, []);

  const handleCloseQuoteDetailModal = useCallback(() => {
    setViewingQuote(null);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (quotesQuery.data?.pages ?? 1)) return;
    setCurrentPage(newPage);
  };

  const quotes = quotesQuery.data?.data ?? [];
  const totalPages = quotesQuery.data?.pages ?? 1;
  const totalQuotes = quotesQuery.data?.total ?? 0;

  const columns = useMemo<ColumnDef<Quote>[]>(() => {
    const statusStyles: Record<QuoteStatus, string> = {
      [QuoteStatus.DRAFT]: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
      [QuoteStatus.SENT]: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      [QuoteStatus.ACCEPTED]: 'bg-green-500/10 text-green-700 dark:text-green-400',
      [QuoteStatus.REJECTED]: 'bg-red-500/10 text-red-700 dark:text-red-400',
      [QuoteStatus.INVOICED]: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      [QuoteStatus.EXPIRED]: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    };

    const statusLabels: Record<QuoteStatus, string> = {
      [QuoteStatus.DRAFT]: 'Borrador',
      [QuoteStatus.SENT]: 'Enviada',
      [QuoteStatus.ACCEPTED]: 'Aceptada',
      [QuoteStatus.REJECTED]: 'Rechazada',
      [QuoteStatus.INVOICED]: 'Facturada',
      [QuoteStatus.EXPIRED]: 'Expirada',
    };

    return [
      {
        id: 'quoteId',
        header: 'ID Cotización',
        accessorFn: (quote) => quote.id,
        cell: ({ row }) => (
          <span className='font-mono text-muted-foreground'>
            {row.original.id.substring(0, 8)}...
          </span>
        ),
      },
      {
        accessorKey: 'company',
        header: 'Empresa',
        cell: ({ row }) => (
          <div className='font-medium text-foreground'>
            {row.original.company?.name ?? 'Sin empresa'}
          </div>
        ),
      },
      {
        accessorKey: 'quoteDate',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className='text-muted-foreground'>
            {new Date(row.original.quoteDate).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[row.original.status]
              }`}
          >
            {statusLabels[row.original.status]}
          </span>
        ),
      },
      {
        accessorKey: 'grandTotalAmount',
        header: 'Total',
        cell: ({ row }) => (
          <span className='font-semibold text-primary'>
            {formatCurrencyChilean(row.original.grandTotalAmount)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const quote = row.original;
          return (
            <div className='flex items-center justify-center space-x-1 sm:space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleViewQuote(quote)}
                title='Ver Detalles de Cotización'
                aria-label={`Ver detalles de cotización ${quote.id.substring(0, 8)}`}
              >
                <EyeIcon className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleEditQuote(quote)}
                title='Editar Cotización'
                aria-label={`Editar cotización ${quote.id.substring(0, 8)}`}
              >
                <PencilIcon className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleDeleteQuoteRequest(quote)}
                title='Eliminar Cotización'
                aria-label={`Eliminar cotización ${quote.id.substring(0, 8)}`}
              >
                <TrashIcon className='w-5 h-5' />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [handleDeleteQuoteRequest, handleEditQuote, handleViewQuote]);

  if (authLoading) {
    return <div className='text-center py-8'>Cargando autenticación...</div>;
  }

  if (!hasAccess) {
    return (
      <div className='text-center py-8 text-destructive'>
        Acceso denegado. No tienes permisos suficientes.
      </div>
    );
  }

  if (quotesQuery.isLoading) {
    return <div className='text-center py-8'>Cargando cotizaciones...</div>;
  }

  if (showQuoteForm) {
    return (
      <QuoteForm
        quoteData={editingQuote}
        onSave={handleSaveQuote}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <>
      <div className='space-y-6 lg:space-y-8'>
        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            <DataTable<Quote>
              columns={columns}
              data={quotes}
              filterColumn='company'
              filterPlaceholder='Buscar por empresa...'
              hidePagination
              renderToolbar={
                <div className='flex items-center gap-2'>
                  <Select
                    onValueChange={(value) => setStatusFilter(value as QuoteStatus | 'all')}
                    defaultValue={statusFilter}
                  >
                    <SelectTrigger className='w-[160px]'>
                      <SelectValue placeholder='Filtrar por estado' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Todas</SelectItem>
                      <SelectItem value={QuoteStatus.DRAFT}>Borrador</SelectItem>
                      <SelectItem value={QuoteStatus.SENT}>Enviada</SelectItem>
                      <SelectItem value={QuoteStatus.ACCEPTED}>Aceptada</SelectItem>
                      <SelectItem value={QuoteStatus.REJECTED}>Rechazada</SelectItem>
                      <SelectItem value={QuoteStatus.INVOICED}>Facturada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className='w-full sm:w-auto' onClick={handleCreateNewQuote}>
                    <PlusIcon className='w-5 h-5 mr-2' />
                    <span>Nueva Cotización</span>
                  </Button>
                </div>
              }
              emptyState={
                <div className='text-center py-12 px-4'>
                  <DocumentTextIcon className='mx-auto h-16 w-16 text-muted-foreground opacity-40' />
                  <h3 className='mt-3 text-xl font-semibold text-foreground'>
                    No hay cotizaciones para el estado seleccionado
                  </h3>
                  <p className='mt-1.5 text-sm text-muted-foreground'>
                    Prueba a seleccionar otro estado o crea una nueva cotización.
                  </p>
                  <div className='mt-6'>
                    <Button type='button' onClick={handleCreateNewQuote}>
                      <PlusIcon className='w-5 h-5 mr-2' />
                      <span>Crear Cotización</span>
                    </Button>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>

        {quotes.length > 0 && totalPages > 1 && (
          <div className='flex justify-between items-center mt-4'>
            <div>
              <p className='text-sm text-muted-foreground'>
                Página {currentPage} de {totalPages} (Total: {totalQuotes} cotizaciones)
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || quotesQuery.isFetching}
              >
                Anterior
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || quotesQuery.isFetching}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* {viewingQuote && (
        <QuoteDetailModal
          quote={viewingQuote}
          onClose={handleCloseQuoteDetailModal}
        />
      )} */}
      {showDeleteConfirmModal && quoteToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteQuote}
          title='Confirmar Eliminación'
          message={
            <>
              ¿Estás seguro de que quieres eliminar la cotización{' '}
              <strong>{quoteToDelete.id.substring(0, 8)}...</strong> para la empresa{' '}
              <strong>{quoteToDelete.company?.name ?? 'Sin empresa'}</strong>? Esta acción
              no se puede deshacer.
            </>
          }
          confirmText='Eliminar Cotización'
          confirmButtonClass='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
          icon={<TrashIcon className='w-5 h-5 mr-2' />}
        />
      )}
    </>
  );
};

export default QuotesView;
