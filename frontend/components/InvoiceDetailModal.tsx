import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Invoice, Payment, PaymentMethod } from '@/lib/types'
import { formatCurrencyChilean } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaymentService } from '@/lib/services/paymentService'
import { InvoiceService } from '@/lib/services/invoiceService'
import PaymentForm from './PaymentForm'
import { toast } from 'sonner'

interface InvoiceDetailModalProps {
  invoice: Invoice
  onClose: () => void
  onPaymentSuccess: () => void
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onPaymentSuccess,
}) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  useEffect(() => {
    if (invoice) {
      PaymentService.getPaymentsByInvoice(invoice.id).then(setPayments)
    }
  }, [invoice])

  const handleSavePayment = async (data: {
    amount: string
    paymentDate: string
    paymentMethod: PaymentMethod
    notes?: string
  }) => {
    try {
      const numericAmount = parseFloat(data.amount)
      if (isNaN(numericAmount) || numericAmount <= 0) {
        toast.error('El monto debe ser un número positivo.')
        return
      }
      await PaymentService.createPayment({
        ...data,
        amount: numericAmount,
        invoiceId: invoice.id,
      })
      toast.success('Pago registrado exitosamente.')
      setShowPaymentForm(false)
      onPaymentSuccess() // This will trigger a refresh in the parent component
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al registrar el pago.'
      )
    }
  }

  const totalPaid = payments.reduce(
    (acc, p) => acc + parseFloat(p.amount as any),
    0
  )
  const amountDue = parseFloat(invoice.grandTotal as any) - totalPaid

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            Detalle de Factura - {invoice.invoiceNumber}
          </DialogTitle>
          <DialogDescription>
            Aquí puedes ver los detalles completos de la factura, incluyendo los
            ítems, pagos registrados y el monto adeudado.
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
          <div>
            <strong>Empresa:</strong> {invoice.company?.name}
          </div>
          <div>
            <strong>Fecha de Emisión:</strong>{' '}
            {new Date(invoice.issueDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Fecha de Vencimiento:</strong>{' '}
            {invoice.dueDate
              ? new Date(invoice.dueDate).toLocaleDateString()
              : 'N/A'}
          </div>
          <div>
            <strong>Estado:</strong> {invoice.status}
          </div>
          <div>
            <strong>Orden de Venta:</strong> {invoice.orderId}
          </div>
        </div>
        <h4 className='font-semibold mt-4'>Ítems de la Factura</h4>
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
            {invoice.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell className='text-center'>{item.quantity}</TableCell>
                <TableCell className='text-right'>
                  {formatCurrencyChilean(item.unitPrice)}
                </TableCell>
                <TableCell className='text-right'>
                  {formatCurrencyChilean(item.totalPriceWithVat)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex justify-end mt-4 space-x-4 font-semibold'>
          <div>Subtotal:</div>
          <div>{formatCurrencyChilean(invoice.subTotalAmount)}</div>
        </div>
        <div className='flex justify-end mt-2 space-x-4 font-semibold'>
          <div>IVA (19%):</div>
          <div>{formatCurrencyChilean(invoice.vatAmount)}</div>
        </div>
        <div className='flex justify-end mt-2 space-x-4 font-bold text-lg'>
          <div>Total:</div>
          <div>{formatCurrencyChilean(invoice.grandTotal)}</div>
        </div>

        <h4 className='font-semibold mt-6'>Pagos</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatCurrencyChilean(payment.amount)}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>{payment.notes}</TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className='text-center'>
                  No hay pagos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className='flex justify-end mt-2 space-x-4 font-bold text-lg'>
          <div>Total Pagado:</div>
          <div>{formatCurrencyChilean(totalPaid)}</div>
        </div>
        <div className='flex justify-end mt-2 space-x-4 font-bold text-lg text-destructive'>
          <div>Monto Adeudado:</div>
          <div>{formatCurrencyChilean(amountDue)}</div>
        </div>

        {showPaymentForm ? (
          <div className='mt-6'>
            <h4 className='font-semibold mb-4'>Registrar Nuevo Pago</h4>
            <PaymentForm
              invoice={invoice}
              onSave={() => {
                setShowPaymentForm(false)
                onPaymentSuccess()
              }}
              onCancel={() => setShowPaymentForm(false)}
            />
          </div>
        ) : (
          amountDue > 0 && (
            <div className='mt-6 flex justify-end'>
              <Button onClick={() => setShowPaymentForm(true)}>
                Registrar Pago
              </Button>
            </div>
          )
        )}

        <DialogFooter className='mt-6'>
          <Button
            variant='outline'
            onClick={async () => {
              try {
                const response = await InvoiceService.getInvoicePdf(invoice.id)
                alert(response.message)
              } catch (error) {
                toast.error('Error al generar el PDF.')
              }
            }}
          >
            Ver PDF
          </Button>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvoiceDetailModal
