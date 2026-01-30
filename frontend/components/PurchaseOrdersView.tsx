import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PurchaseOrderForm from '@/components/PurchaseOrderForm'
import { PlusIcon, ShoppingCartIcon } from '@/components/Icons'
import { PurchaseOrder, UserRole, Company } from '@/lib/types'
import { formatCurrencyChilean } from '@/lib/utils'
import { PurchaseOrderService } from '@/lib/services/purchaseOrderService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const PurchaseOrdersView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [showPurchaseOrderForm, setShowPurchaseOrderForm] =
    useState<boolean>(false)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPurchaseOrders, setTotalPurchaseOrders] = useState(0)

  const fetchPurchaseOrders = useCallback(
    async (page: number = 1) => {
      if (
        !isAuthenticated ||
        (currentUser?.role !== UserRole.ADMIN &&
          currentUser?.role !== UserRole.EDITOR)
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
        const response = await PurchaseOrderService.getAllPurchaseOrders(page)
        setPurchaseOrders(response.data)
        setTotalPages(response.pages)
        setCurrentPage(response.page)
        setTotalPurchaseOrders(response.total)
      } catch (err: any) {
        console.error('Error fetching purchase orders:', err)
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login')
        } else {
          setError('Error al cargar las órdenes de compra.')
        }
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated, currentUser, router]
  )

  useEffect(() => {
    if (!authLoading) {
      fetchPurchaseOrders(currentPage)
    }
  }, [fetchPurchaseOrders, currentPage, authLoading])

  const handleCreateNewPurchaseOrder = useCallback(() => {
    setShowPurchaseOrderForm(true)
  }, [])

  const handleSavePurchaseOrder = useCallback(async () => {
    setShowPurchaseOrderForm(false)
    fetchPurchaseOrders(currentPage)
  }, [fetchPurchaseOrders, currentPage])

  const handleCancelPurchaseOrderForm = useCallback(() => {
    setShowPurchaseOrderForm(false)
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (authLoading) {
    return <div className='text-center py-8'>Cargando autenticación...</div>
  }

  if (loading) {
    return <div className='text-center py-8'>Cargando órdenes de compra...</div>
  }

  if (error) {
    return <div className='text-center py-8 text-destructive'>{error}</div>
  }

  if (
    !isAuthenticated ||
    (currentUser?.role !== UserRole.ADMIN &&
      currentUser?.role !== UserRole.EDITOR)
  ) {
    return (
      <div className='text-center py-8 text-destructive'>
        Acceso denegado. No tienes permisos suficientes.
      </div>
    )
  }

  if (showPurchaseOrderForm) {
    return (
      <PurchaseOrderForm
        onSave={handleSavePurchaseOrder}
        onCancel={handleCancelPurchaseOrderForm}
      />
    )
  }

  return (
    <>
      <div className='space-y-6 lg:space-y-8'>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Órdenes de Compra</h1>
          <Button
            className='w-full sm:w-auto'
            onClick={handleCreateNewPurchaseOrder}
          >
            <PlusIcon className='w-5 h-5 mr-2' />
            <span>Crear Nueva Orden de Compra</span>
          </Button>
        </div>

        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            {purchaseOrders.length > 0 ? (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader className='bg-muted/50'>
                    <TableRow>
                      <TableHead>ID Orden</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Fecha Pedido
                      </TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((purchaseOrder) => (
                      <TableRow
                        key={purchaseOrder.id}
                        className='hover:bg-accent transition-colors duration-150'
                      >
                        <TableCell className='font-mono text-muted-foreground'>
                          {purchaseOrder.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className='font-medium text-foreground'>
                            {purchaseOrder.company?.name}
                          </div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell text-muted-foreground'>
                          {new Date(
                            purchaseOrder.orderDate
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='font-semibold text-primary text-right'>
                          {formatCurrencyChilean(purchaseOrder.grandTotal)}
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
                  No hay órdenes de compra registradas
                </h3>
                <p className='mt-1.5 text-sm text-muted-foreground'>
                  Comienza creando una nueva orden de compra para verla listada
                  aquí.
                </p>
                <div className='mt-6'>
                  <Button type='button' onClick={handleCreateNewPurchaseOrder}>
                    <PlusIcon className='w-5 h-5 mr-2' />
                    <span>Crear Primera Orden de Compra</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className='flex justify-between items-center mt-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Página {currentPage} de {totalPages} (Total: {totalPurchaseOrders}{' '}
              órdenes)
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
}

export default PurchaseOrdersView
