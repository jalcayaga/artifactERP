import React, {
  useState,
  FormEvent,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  SearchIcon,
} from '@/components/Icons'
import { Product, Company, CreatePurchaseOrderDto } from '@/lib/types'
import { formatCurrencyChilean } from '@/lib/utils'
import { ProductService } from '@/lib/services/productService'
import { PurchaseOrderService } from '@/lib/services/purchaseOrderService'
import { CompanyService } from '@/lib/services/companyService'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface PurchaseOrderFormProps {
  onSave: () => void
  onCancel: () => void
}

const FIXED_VAT_RATE_PERCENT = 19

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  onSave,
  onCancel,
}) => {
  const { token } = useAuth()
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [companies, setCompanies] = useState<Company[]>([])
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedProductToAdd, setSelectedProductToAdd] =
    useState<Product | null>(null)
  const [quantityToAdd, setQuantityToAdd] = useState('')
  const [unitPriceToAdd, setUnitPriceToAdd] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [itemErrors, setItemErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      CompanyService.getAllCompanies(1, 1000, { isSupplier: true })
        .then((res) => {
          setCompanies(res.data)
        })
        .catch((err) => console.error('Error fetching suppliers:', err))
    }
  }, [token])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2 && token) {
        ProductService.searchProducts(token, searchTerm)
          .then((res) => setSearchResults(res.data))
          .catch((err) => console.error('Error searching products:', err))
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, token])

  const handleProductSelect = useCallback(async (product: Product) => {
    setSelectedProductToAdd(product)
    setSearchTerm(product.name)
    setSearchResults([])
    setUnitPriceToAdd(product.unitPrice?.toString() || '')
  }, [])

  const { subTotal, totalVatAmount, grandTotal } = useMemo(() => {
    const currentSubTotal = items.reduce(
      (total, item) => total + item.totalPrice,
      0
    )
    const currentTotalVatAmount = items.reduce(
      (total, item) => total + item.itemVatAmount,
      0
    )
    const currentGrandTotal = currentSubTotal + currentTotalVatAmount
    return {
      subTotal: currentSubTotal,
      totalVatAmount: currentTotalVatAmount,
      grandTotal: currentGrandTotal,
    }
  }, [items])

  const validateItemForm = (): boolean => {
    const newItmErrors: { [key: string]: string } = {}
    if (!selectedProductToAdd)
      newItmErrors.product = 'Debe seleccionar un producto.'
    const quantityNum = parseFloat(quantityToAdd)
    if (isNaN(quantityNum) || quantityNum <= 0)
      newItmErrors.quantity = 'La cantidad debe ser un número positivo.'
    const priceNum = parseFloat(unitPriceToAdd)
    if (isNaN(priceNum) || priceNum < 0)
      newItmErrors.price = 'El precio debe ser un número positivo o cero.'
    setItemErrors(newItmErrors)
    return Object.keys(newItmErrors).length === 0
  }

  const handleAddItem = useCallback(() => {
    if (!validateItemForm() || !selectedProductToAdd) return

    const quantity = parseFloat(quantityToAdd)
    const unitPrice = parseFloat(unitPriceToAdd)
    const totalItemPrice = quantity * unitPrice
    const itemVatAmount = totalItemPrice * (FIXED_VAT_RATE_PERCENT / 100)
    const totalPriceWithVat = totalItemPrice + itemVatAmount

    const newItem = {
      productId: selectedProductToAdd.id,
      productName: selectedProductToAdd.name,
      quantity,
      unitPrice,
      totalPrice: totalItemPrice,
      itemVatAmount,
      totalPriceWithVat,
    }

    setItems((prevItems) => [...prevItems, newItem])
    setSearchTerm('')
    setSelectedProductToAdd(null)
    setQuantityToAdd('')
    setUnitPriceToAdd('')
    setItemErrors({})
  }, [selectedProductToAdd, quantityToAdd, unitPriceToAdd])

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }, [])

  const validateMainForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!selectedCompanyId)
      newErrors.selectedCompanyId = 'Debe seleccionar un proveedor.'
    if (!orderDate) newErrors.orderDate = 'La fecha de pedido es requerida.'
    if (items.length === 0)
      newErrors.items = 'Debe añadir al menos un artículo a la orden de compra.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateMainForm()) return

    setIsSubmitting(true)
    try {
      const purchaseOrderDetails: CreatePurchaseOrderDto = {
        companyId: selectedCompanyId,
        orderDate,
        expectedDeliveryDate: expectedDeliveryDate || undefined,
        status: 'PENDING',
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
        })),
        subTotalAmount: subTotal,
        totalVatAmount: totalVatAmount,
        grandTotal: grandTotal,
      }

      await PurchaseOrderService.createPurchaseOrder(purchaseOrderDetails)
      toast.success('Orden de compra registrada exitosamente.')
      onSave()
    } catch (error: any) {
      console.error('Error creating purchase order:', error)
      toast.error(error.message || 'Error al registrar la orden de compra.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBaseClass =
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground'
  const errorTextClass = 'mt-1 text-xs text-destructive'

  return (
    <Card className='max-w-4xl mx-auto border'>
      <CardHeader>
        <CardTitle className='text-xl'>Crear Nueva Orden de Compra</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-6 pt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <Label htmlFor='company-select'>
                Proveedor <span className='text-red-500'>*</span>
              </Label>
              <Select
                onValueChange={setSelectedCompanyId}
                value={selectedCompanyId}
              >
                <SelectTrigger id='company-select'>
                  <SelectValue placeholder='Selecciona un proveedor' />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedCompanyId && (
                <p id='company-error' className={errorTextClass}>
                  {errors.selectedCompanyId}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='order-date'>
                Fecha de Pedido <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='date'
                id='order-date'
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
              {errors.orderDate && (
                <p id='orderDate-error' className={errorTextClass}>
                  {errors.orderDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='expected-delivery-date'>
              Fecha de Entrega Esperada
            </Label>
            <Input
              type='date'
              id='expected-delivery-date'
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            />
          </div>

          <div className='space-y-4 p-4 rounded-md bg-card'>
            <h3 className='text-md font-semibold text-foreground'>
              Artículos de la Orden de Compra
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-12 gap-4 items-end'>
              <div className='sm:col-span-5 relative'>
                <Label htmlFor='product-search'>Buscar Producto</Label>
                <Input
                  id='product-search'
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Escribe para buscar productos...'
                  className='pr-10'
                />
                <SearchIcon className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                {searchResults.length > 0 && (
                  <div className='absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto'>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className='px-3 py-2 hover:bg-accent cursor-pointer text-sm'
                        onClick={() => handleProductSelect(product)}
                      >
                        {product.name} {product.sku ? `(${product.sku})` : ''}
                      </div>
                    ))}
                  </div>
                )}
                {itemErrors.product && (
                  <p className={errorTextClass}>{itemErrors.product}</p>
                )}
              </div>

              {selectedProductToAdd && (
                <div className='sm:col-span-7 grid grid-cols-1 sm:grid-cols-5 gap-4'>
                  <div className='sm:col-span-2'>
                    <Label htmlFor='item-quantity'>Cantidad</Label>
                    <Input
                      type='number'
                      id='item-quantity'
                      value={quantityToAdd}
                      onChange={(e) => setQuantityToAdd(e.target.value)}
                      placeholder='0'
                    />
                    {itemErrors.quantity && (
                      <p className={errorTextClass}>{itemErrors.quantity}</p>
                    )}
                  </div>
                  <div className='sm:col-span-3'>
                    <Label htmlFor='item-price'>Costo Unit. (sin IVA)</Label>
                    <Input
                      type='number'
                      id='item-price'
                      value={unitPriceToAdd}
                      onChange={(e) => setUnitPriceToAdd(e.target.value)}
                      placeholder='0.00'
                      step='0.01'
                    />
                    {itemErrors.price && (
                      <p className={errorTextClass}>{itemErrors.price}</p>
                    )}
                  </div>
                  <div className='sm:col-span-5'>
                    <Button
                      type='button'
                      onClick={handleAddItem}
                      className='w-full'
                    >
                      <PlusIcon className='w-4 h-4 mr-2' /> Añadir Artículo
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 ? (
              <div className='mt-4 -mx-4 sm:mx-0 overflow-x-auto'>
                <table className='min-w-full divide-y divide-border'>
                  <thead className='bg-muted/50'>
                    <tr>
                      <th className='px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Producto
                      </th>
                      <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Cant.
                      </th>
                      <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Costo Unit. (s/IVA)
                      </th>
                      <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Subtotal (s/IVA)
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider'></th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-border'>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className='px-3 py-2 whitespace-nowrap text-sm text-foreground'>
                          {item.productName}
                        </td>
                        <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right'>
                          {item.quantity}
                        </td>
                        <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right'>
                          {formatCurrencyChilean(item.unitPrice)}
                        </td>
                        <td className='px-3 py-2 whitespace-nowrap text-sm text-foreground font-medium text-right'>
                          {formatCurrencyChilean(item.totalPrice)}
                        </td>
                        <td className='px-3 py-2 whitespace-nowrap text-center'>
                          <button
                            type='button'
                            onClick={() => handleRemoveItem(index)}
                            title='Eliminar Artículo'
                            className='text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 transition-colors'
                          >
                            <TrashIcon className='w-4 h-4' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-sm text-center text-muted-foreground italic py-3'>
                Aún no se han añadido artículos a la orden de compra.
              </p>
            )}
            {errors.items && (
              <p className={errorTextClass + ' text-center'}>{errors.items}</p>
            )}
          </div>

          <div className='mt-6 pt-4 border-t border-border space-y-2'>
            <div className='flex justify-end items-center'>
              <span className='text-md font-medium text-muted-foreground'>
                Subtotal (sin IVA):
              </span>
              <span className='ml-4 text-md font-semibold text-foreground w-32 text-right'>
                {formatCurrencyChilean(subTotal)}
              </span>
            </div>
            <div className='flex justify-end items-center'>
              <span className='text-md font-medium text-muted-foreground'>
                IVA ({FIXED_VAT_RATE_PERCENT}%):
              </span>
              <span className='ml-4 text-md font-semibold text-foreground w-32 text-right'>
                {formatCurrencyChilean(totalVatAmount)}
              </span>
            </div>
            <div className='flex justify-end items-center mt-1 pt-1 border-t border-border/50'>
              <span className='text-lg font-bold text-foreground'>
                Total Orden:
              </span>
              <span className='ml-4 text-2xl font-bold text-primary w-32 text-right'>
                {formatCurrencyChilean(grandTotal)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-end items-center gap-3 pt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='w-full sm:w-auto order-2 sm:order-1'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            className='w-full sm:w-auto order-1 sm:order-2'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Crear Orden de Compra'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default PurchaseOrderForm
