import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import QuoteForm from '@/components/QuoteForm'
import QuoteDetailModal from '@/components/QuoteDetailModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@/components/Icons'
import {
  Quote,
  CreateQuoteDto,
  UpdateQuoteDto,
  UserRole,
  Company,
  QuoteStatus,
} from '@/lib/types'
import { formatCurrencyChilean } from '@/lib/utils'
import { QuoteService } from '@/lib/services/quoteService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const QuotesView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [showQuoteForm, setShowQuoteForm] = useState<boolean>(false)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
    useState<boolean>(false)
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalQuotes, setTotalQuotes] = useState(0)
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>(QuoteStatus.SENT)

  const fetchQuotes = useCallback(
    async (page: number = 1, status: QuoteStatus | 'all' = QuoteStatus.SENT) => {
      if (
        !isAuthenticated ||
        (currentUser?.role !== UserRole.ADMIN &&
          currentUser?.role !== UserRole.EDITOR &&
          currentUser?.role !== UserRole.VIEWER)
      ) {
        setError('No autorizado para ver esta página o no autenticado.')
        setLoading(false)
        if (!isAuthenticated) {
          router.push('/login')
        }
        return
      }
      setLoading(true)
      try {
        const response = await QuoteService.getAllQuotes(
          page,
          10,
          status === 'all' ? undefined : status
        )
        setQuotes(response.data)
        setTotalPages(response.pages)
        setCurrentPage(response.page)
        setTotalQuotes(response.total)
      } catch (err: any) {
        console.error('Error fetching quotes:', err)
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login')
        } else {
          setError('Error al cargar las cotizaciones.')
        }
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated, currentUser, router]
  )

  useEffect(() => {
    if (!authLoading) {
      fetchQuotes(currentPage, statusFilter)
    }
  }, [fetchQuotes, currentPage, authLoading, statusFilter])

  const handleCreateNewQuote = useCallback(() => {
    setEditingQuote(null)
    setShowQuoteForm(true)
  }, [])

  const handleEditQuote = useCallback((quote: Quote) => {
    setEditingQuote(quote)
    setShowQuoteForm(true)
  }, [])

  const handleDeleteQuoteRequest = useCallback((quote: Quote) => {
    setQuoteToDelete(quote)
    setShowDeleteConfirmModal(true)
  }, [])

  const handleConfirmDeleteQuote = useCallback(async () => {
    if (quoteToDelete) {
      try {
        await QuoteService.deleteQuote(quoteToDelete.id)
        fetchQuotes(currentPage, statusFilter)
        setQuoteToDelete(null)
        setShowDeleteConfirmModal(false)
      } catch (err: any) {
        console.error('Error deleting quote:', err)
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login')
        } else {
          setError('Error al eliminar la cotización.')
        }
      }
    }
  }, [quoteToDelete, fetchQuotes, currentPage, statusFilter, router])

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setQuoteToDelete(null)
    setShowDeleteConfirmModal(false)
  }, [])

  const handleSaveQuote = useCallback(
    async (quoteData: CreateQuoteDto | UpdateQuoteDto) => {
      try {
        if (editingQuote) {
          await QuoteService.updateQuote(
            editingQuote.id,
            quoteData as UpdateQuoteDto
          )
        } else {
          await QuoteService.createQuote(quoteData as CreateQuoteDto)
        }
        setShowQuoteForm(false)
        setEditingQuote(null)
        fetchQuotes(currentPage, statusFilter)
      } catch (err: any) {
        console.error('Error saving quote:', err)
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login')
        } else {
          setError('Error al guardar la cotización.')
        }
      }
    },
    [editingQuote, fetchQuotes, currentPage, statusFilter, router]
  )

  const handleCloseForm = useCallback(() => {
    setShowQuoteForm(false)
    setEditingQuote(null)
  }, [])

  const handleViewQuote = useCallback((quote: Quote) => {
    setViewingQuote(quote)
  }, [])

  const handleCloseQuoteDetailModal = useCallback(() => {
    setViewingQuote(null)
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const getStatusBadgeClasses = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
      case QuoteStatus.SENT:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case QuoteStatus.ACCEPTED:
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case QuoteStatus.REJECTED:
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      case QuoteStatus.INVOICED:
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getQuoteStatusTranslation = (status: QuoteStatus): string => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'Borrador'
      case QuoteStatus.SENT:
        return 'Enviada'
      case QuoteStatus.ACCEPTED:
        return 'Aceptada'
      case QuoteStatus.REJECTED:
        return 'Rechazada'
      case QuoteStatus.INVOICED:
        return 'Facturada'
      default:
        return 'Pendiente'
    }
  }

  if (authLoading) {
    return <div className='text-center py-8'>Cargando autenticación...</div>
  }

  if (loading) {
    return <div className='text-center py-8'>Cargando cotizaciones...</div>
  }

  if (error) {
    return <div className='text-center py-8 text-destructive'>{error}</div>
  }

  if (
    !isAuthenticated ||
    (currentUser?.role !== UserRole.ADMIN &&
      currentUser?.role !== UserRole.EDITOR &&
      currentUser?.role !== UserRole.VIEWER)
  ) {
    return (
      <div className='text-center py-8 text-destructive'>
        Acceso denegado. No tienes permisos suficientes.
      </div>
    )
  }

  if (showQuoteForm) {
    return (
      <QuoteForm
        quoteData={editingQuote}
        onSave={handleSaveQuote}
        onCancel={handleCloseForm}
      />
    )
  }

  return (
    <>
      <div className='space-y-6 lg:space-y-8'>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Cotizaciones</h1>
          <div className="flex items-center space-x-4">
            <Select
              onValueChange={(value) =>
                setStatusFilter(value as QuoteStatus | 'all')
              }
              defaultValue={statusFilter}
            >
              <SelectTrigger className="w-[180px]">
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
              <span>Crear Nueva Cotización</span>
            </Button>
          </div>
        </div>

        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            {quotes.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader className='bg-muted/50'>
                    <TableRow>
                      <TableHead>ID Cotización</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Fecha
                      </TableHead>
                      <TableHead className='hidden lg:table-cell'>
                        Estado
                      </TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                      <TableHead className='text-center'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow
                        key={quote.id}
                        className='hover:bg-accent transition-colors duration-150'
                      >
                        <TableCell className='font-mono text-muted-foreground'>
                          {quote.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className='text-sm font-medium text-foreground'>
                            {quote.company?.name}
                          </div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell text-muted-foreground'>
                          {new Date(quote.quoteDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='hidden lg:table-cell'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(
                              quote.status
                            )}`}
                          >
                            {getQuoteStatusTranslation(quote.status)}
                          </span>
                        </TableCell>
                        <TableCell className='font-semibold text-primary text-right'>
                          {formatCurrencyChilean(quote.grandTotalAmount)}
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center justify-center space-x-1 sm:space-x-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleViewQuote(quote)}
                              title='Ver Detalles de Cotización'
                              aria-label={`Ver detalles de cotización ${quote.id.substring(
                                0,
                                8
                              )}`}
                            >
                              <EyeIcon className='w-5 h-5' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleEditQuote(quote)}
                              title='Editar Cotización'
                              aria-label={`Editar cotización ${quote.id.substring(
                                0,
                                8
                              )}`}
                            >
                              <PencilIcon className='w-5 h-5' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDeleteQuoteRequest(quote)}
                              title='Eliminar Cotización'
                              aria-label={`Eliminar cotización ${quote.id.substring(
                                0,
                                8
                              )}`}
                            >
                              <TrashIcon className='w-5 h-5' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        <div className='flex justify-between items-center mt-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Página {currentPage} de {totalPages} (Total: {totalQuotes}{' '}
              cotizaciones)
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
      {viewingQuote && (
        <QuoteDetailModal
          quote={viewingQuote}
          onClose={handleCloseQuoteDetailModal}
        />
      )}
      {showDeleteConfirmModal && quoteToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteQuote}
          title='Confirmar Eliminación de Cotización'
          message={
            <>
              ¿Estás seguro de que quieres eliminar la cotización{' '}
              <strong>ID: {quoteToDelete.id.substring(0, 8)}...</strong> para la
              empresa <strong>{quoteToDelete.company?.name}</strong>? Esta
              acción no se puede deshacer.
            </>
          }
          confirmText='Eliminar Cotización'
          confirmButtonClass='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
          icon={<TrashIcon className='w-5 h-5 mr-2' />}
        />
      )}
    </>
  )
}

export default QuotesView
