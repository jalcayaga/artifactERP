import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Quote } from '@/lib/types'
import { formatCurrencyChilean } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface QuoteDetailModalProps {
  quote: Quote
  onClose: () => void
}

const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  quote,
  onClose,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            Detalle de Cotización - ID: {quote.id.substring(0, 8)}...
          </DialogTitle>
          <DialogDescription>
            Aquí puedes ver los detalles completos de la cotización
            seleccionada, incluyendo información de la empresa, fechas y los
            ítems cotizados.
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
          <div>
            <strong>Empresa:</strong> {quote.company?.name}
          </div>
          <div>
            <strong>Fecha:</strong>{' '}
            {new Date(quote.quoteDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Vencimiento:</strong>{' '}
            {quote.expiryDate
              ? new Date(quote.expiryDate).toLocaleDateString()
              : 'N/A'}
          </div>
          <div>
            <strong>Estado:</strong> {quote.status}
          </div>
          {quote.notes && (
            <div className='col-span-2'>
              <strong>Notas:</strong> {quote.notes}
            </div>
          )}
        </div>
        <h4 className='font-semibold mt-4'>Ítems de la Cotización</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className='text-center'>Cantidad</TableHead>
              <TableHead className='text-right'>Precio Unit.</TableHead>
              <TableHead className='text-right'>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quote.items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product?.name}</TableCell>
                <TableCell className='text-center'>{item.quantity}</TableCell>
                <TableCell className='text-right'>
                  {formatCurrencyChilean(parseFloat(item.unitPrice as any))}
                </TableCell>
                <TableCell className='text-right'>
                  {formatCurrencyChilean(
                    parseFloat(item.totalPriceWithVat as any)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex justify-end mt-4 space-x-4 font-semibold'>
          <div>Subtotal:</div>
          <div>
            {formatCurrencyChilean(parseFloat(quote.subTotalAmount as any))}
          </div>
        </div>
        <div className='flex justify-end mt-2 space-x-4 font-semibold'>
          <div>IVA (19%):</div>
          <div>
            {formatCurrencyChilean(parseFloat(quote.totalVatAmount as any))}
          </div>
        </div>
        <div className='flex justify-end mt-2 space-x-4 font-bold text-lg'>
          <div>Total:</div>
          <div>
            {formatCurrencyChilean(parseFloat(quote.grandTotalAmount as any))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default QuoteDetailModal
