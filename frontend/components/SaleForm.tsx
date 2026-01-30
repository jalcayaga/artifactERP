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
import {
  Sale,
  OrderItem,
  Product,
  LotInfo,
  CreateSaleDto,
  CreateSaleItemDto,
  Company,
  OrderStatus,
  PaymentStatus,
} from '@/lib/types'
import { formatCurrencyChilean } from '@/lib/utils'
import { ProductService } from '@/lib/services/productService'
import { SaleService } from '@/lib/services/saleService'
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
import CreatePurchaseOrderModal from './CreatePurchaseOrderModal'
import { PurchaseService } from '@/lib/services/purchaseService'

interface SaleFormProps {
  saleData?: Sale | null // Datos de la venta para edición (opcional)
  onSave: (saleData: Sale) => void // onSave now expects Sale, not CreateSaleDto
  onCancel: () => void
}

const FIXED_VAT_RATE_PERCENT = 19

const SaleForm: React.FC<SaleFormProps> = ({ saleData, onSave, onCancel }) => {
  const { token, currentUser } = useAuth()
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('') // State for selected client ID
  const [companies, setCompanies] = useState<Company[]>([]) // State for list of clients
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [observations, setObservations] = useState('')
  const [items, setItems] = useState<CreateSaleItemDto[]>([])

  // Estados para la búsqueda y selección de productos
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedProductToAdd, setSelectedProductToAdd] =
    useState<Product | null>(null)
  const [selectedProductLots, setSelectedProductLots] = useState<LotInfo[]>([])
  const [quantityToAdd, setQuantityToAdd] = useState('')
  const [unitPriceToAdd, setUnitPriceToAdd] = useState('')
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [itemErrors, setItemErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [outOfStockInfo, setOutOfStockInfo] = useState(null)

  const isEditing = useMemo(() => !!saleData, [saleData])

  // Fetch clients on component mount
  useEffect(() => {
    if (token) {
      CompanyService.getAllCompanies() // Fetch all companies, or implement pagination/search if many
        .then((res) => {
          if (Array.isArray(res)) {
            setCompanies(res.filter((c) => c.isClient))
          } else {
            setCompanies(res.data.filter((c) => c.isClient))
          }
        })
        .catch((err) => console.error('Error fetching companies:', err))
    }
  }, [token])

  useEffect(() => {
    if (saleData) {
      setSelectedCompanyId(saleData.companyId)
      setSaleDate(new Date(saleData.createdAt).toISOString().split('T')[0])
      setObservations(saleData.customerNotes || '')
      setItems([])
    } else {
      setSelectedCompanyId('')
      setSaleDate(new Date().toISOString().split('T')[0])
      setObservations('')
      setItems([])
    }
    setErrors({})
    setItemErrors({})
    setSearchTerm('')
    setSearchResults([])
    setSelectedProductToAdd(null)
    setSelectedProductLots([])
    setQuantityToAdd('')
    setUnitPriceToAdd('')
    setSelectedLotId(null)
  }, [saleData, currentUser])

  // Debounce search term
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

  const handleProductSelect = useCallback(
    async (product: Product) => {
      setSelectedProductToAdd(product)
      setSearchTerm(product.name) // Display selected product name in search input
      setSearchResults([]) // Clear search results
      setUnitPriceToAdd(product.price.toString()) // Set default unit price from product
      setSelectedLotId(null) // Reset selected lot

      if (product.productType === 'PRODUCT' && token) {
        try {
          const lots = await ProductService.getProductLots(product.id, token)
          setSelectedProductLots(lots)
        } catch (error) {
          console.error('Error fetching product lots:', error)
          toast.error('Error al cargar los lotes del producto.')
          setSelectedProductLots([])
        }
      } else {
        setSelectedProductLots([])
      }
    },
    [token]
  )

  const { subTotal, totalVatAmount, grandTotal } = useMemo(() => {
    const currentSubTotal = items.reduce(
      (total, item) => total + parseFloat(item.totalPrice.toString()),
      0
    )
    const currentTotalVatAmount = items.reduce(
      (total, item) => total + parseFloat(item.itemVatAmount.toString()),
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

    if (selectedProductToAdd?.productType === 'PRODUCT' && !selectedLotId) {
      newItmErrors.lot = 'Debe seleccionar un lote para productos físicos.'
    }

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

    const newItem: CreateSaleItemDto = {
      productId: selectedProductToAdd.id,
      quantity,
      unitPrice: unitPrice, // Ensure it's a number
      totalPrice: totalItemPrice, // Ensure it's a number
      itemVatAmount: itemVatAmount, // Ensure it's a number
      totalPriceWithVat: totalPriceWithVat, // Ensure it's a number
    }

    setItems((prevItems) => [...prevItems, newItem])
    // Reset item form fields
    setSearchTerm('')
    setSelectedProductToAdd(null)
    setSelectedProductLots([])
    setQuantityToAdd('')
    setUnitPriceToAdd('')
    setSelectedLotId(null)
    setItemErrors({})
  }, [selectedProductToAdd, quantityToAdd, unitPriceToAdd, selectedLotId])

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }, [])

  const validateMainForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!selectedCompanyId)
      newErrors.selectedCompanyId = 'Debe seleccionar un cliente.'
    if (!saleDate) newErrors.saleDate = 'La fecha de venta es requerida.'
    if (items.length === 0)
      newErrors.items = 'Debe añadir al menos un artículo a la venta.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateMainForm()) return
    if (!currentUser?.id) {
      toast.error('No se pudo determinar el usuario actual.')
      return
    }

    setIsSubmitting(true)
    try {
      const saleDetails: CreateSaleDto = {
        userId: currentUser.id, // Use current user ID
        companyId: selectedCompanyId, // Use selected company ID
        status: saleData?.status || OrderStatus.PENDING_PAYMENT, // Default status
        paymentStatus: saleData?.paymentStatus || PaymentStatus.PENDING, // Default payment status
        subTotalAmount: subTotal,
        vatAmount: totalVatAmount,
        vatRatePercent: FIXED_VAT_RATE_PERCENT,
        discountAmount: 0, // Assuming no discount for now
        shippingAmount: 0, // Assuming no shipping for now
        grandTotalAmount: grandTotal,
        currency: 'CLP', // Default currency
        shippingAddress: saleData?.shippingAddress || undefined,
        billingAddress: saleData?.billingAddress || undefined,
        customerNotes: observations.trim() || undefined,
        paymentMethod: saleData?.paymentMethod || undefined,
        items: items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice, // Already number
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
        })),
      }

      const createdSale = await SaleService.createSale(saleDetails)
      toast.success(
        `Venta ${createdSale.id.substring(0, 8)}... creada exitosamente.`
      )
      onSave(createdSale) // Pass the created sale back to parent
    } catch (error: any) {
      console.error('Error creating sale:', error)
      if (error.response?.data?.errorCode === 'OUT_OF_STOCK') {
        setOutOfStockInfo(error.response.data)
        setShowPurchaseModal(true)
      } else {
        toast.error(error.message || 'Error al crear la venta.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmPurchaseOrder = async (
    productId: string,
    quantity: number,
    companyId: string
  ) => {
    try {
      // This is a simplified example. In a real app, you'd want to select a company
      // and have a more robust way of determining the purchase price.
      const newPurchase = await PurchaseService.createPurchase({
        companyId: companyId, // Replace with a real company ID
        status: 'PENDING', // Default status
        items: [
          {
            productId,
            quantity,
            unitPrice: 0, // You might want to fetch the product's cost price
            totalPrice: 0,
            itemVatAmount: 0,
            totalPriceWithVat: 0,
          },
        ],
        subTotalAmount: 0,
        totalVatAmount: 0,
        grandTotal: 0,
        purchaseDate: new Date().toISOString(),
      })
      toast.success(`Orden de compra creada: ${newPurchase.id}`)
    } catch (error: any) {
      console.error('Error creating purchase order:', error)
      toast.error('Error al crear la orden de compra.')
    }
  }

  const inputBaseClass =
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground'
  const errorTextClass = 'mt-1 text-xs text-destructive'

  return (
    <>
      <Card className='max-w-4xl mx-auto border'>
        <CardHeader>
          <CardTitle className='text-xl'>
            {isEditing
              ? `Editar Venta: ${saleData?.id.substring(0, 8)}...`
              : 'Crear Nueva Venta'}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-6 pt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='client-select'>
                  Cliente <span className='text-red-500'>*</span>
                </Label>
                <Select
                  onValueChange={setSelectedCompanyId}
                  value={selectedCompanyId}
                >
                  <SelectTrigger id='client-select'>
                    <SelectValue placeholder='Selecciona un cliente' />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}{' '}
                        {company.email ? `(${company.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedCompanyId && (
                  <p id='client-error' className={errorTextClass}>
                    {errors.selectedCompanyId}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor='sale-date'>
                  Fecha de Venta <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='date'
                  id='sale-date'
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  aria-describedby='saleDate-error'
                />
                {errors.saleDate && (
                  <p id='saleDate-error' className={errorTextClass}>
                    {errors.saleDate}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-4 p-4 rounded-md bg-card'>
              <h3 className='text-md font-semibold text-foreground'>
                Artículos de la Venta (IVA {FIXED_VAT_RATE_PERCENT}%)
              </h3>

              {/* Product Search and Selection */}
              <div className='grid grid-cols-1 sm:grid-cols-12 gap-4 items-end'>
                <div className='sm:col-span-5 relative'>
                  <Label
                    htmlFor='product-search'
                    className='block text-xs font-medium text-muted-foreground'
                  >
                    Buscar Producto
                  </Label>
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
                          {product.name} {product.sku ? `(${product.sku})` : ''}{' '}
                          - {formatCurrencyChilean(product.price)}
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
                      <Label
                        htmlFor='item-quantity'
                        className='block text-xs font-medium text-muted-foreground'
                      >
                        Cant.
                      </Label>
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
                      <Label
                        htmlFor='item-price'
                        className='block text-xs font-medium text-muted-foreground'
                      >
                        P. Unit. Venta (sin IVA)
                      </Label>
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

                    {selectedProductToAdd.productType === 'PRODUCT' &&
                      selectedProductLots.length > 0 && (
                        <div className='sm:col-span-5'>
                          <Label
                            htmlFor='lot-select'
                            className='block text-xs font-medium text-muted-foreground'
                          >
                            Seleccionar Lote (Precio Compra)
                          </Label>
                          <Select
                            onValueChange={setSelectedLotId}
                            value={selectedLotId || ''}
                          >
                            <SelectTrigger id='lot-select'>
                              <SelectValue placeholder='Selecciona un lote' />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProductLots.map((lot) => (
                                <SelectItem key={lot.id} value={lot.id}>
                                  Lote: {lot.lotNumber} - Cant:{' '}
                                  {lot.currentQuantity} - Compra:{' '}
                                  {formatCurrencyChilean(lot.purchasePrice)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {itemErrors.lot && (
                            <p className={errorTextClass}>{itemErrors.lot}</p>
                          )}
                        </div>
                      )}

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
                          Producto / Servicio
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                          Cant.
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                          P.Unit (s/IVA)
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                          Subtotal (s/IVA)
                        </th>
                        <th className='px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                          IVA Item
                        </th>
                        <th className='px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider'></th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border'>
                      {items.map((item, index) => (
                        <tr key={index}>
                          {' '}
                          {/* Using index as key for now, consider unique IDs if items can be reordered */}
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-foreground'>
                            {item.productId}
                          </td>{' '}
                          {/* Display product ID for now */}
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right'>
                            {item.quantity}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right'>
                            {formatCurrencyChilean(item.unitPrice)}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-foreground font-medium text-right'>
                            {formatCurrencyChilean(item.totalPrice)}
                          </td>
                          <td className='px-3 py-2 whitespace-nowrap text-sm text-muted-foreground text-right hidden sm:table-cell'>
                            {formatCurrencyChilean(item.itemVatAmount)}
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
                  Aún no se han añadido artículos a la venta.
                </p>
              )}
              {errors.items && (
                <p className={errorTextClass + ' text-center'}>
                  {errors.items}
                </p>
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
                  Total Venta:
                </span>
                <span className='ml-4 text-2xl font-bold text-primary w-32 text-right'>
                  {formatCurrencyChilean(grandTotal)}
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor='sale-observations'>Observaciones</Label>
              <textarea
                id='sale-observations'
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
                className={inputBaseClass}
                placeholder='Añadir notas adicionales sobre la venta...'
              ></textarea>
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
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar Venta'
                  : 'Guardar Venta'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <CreatePurchaseOrderModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={handleConfirmPurchaseOrder}
        stockInfo={outOfStockInfo}
      />
    </>
  )
}

export default SaleForm
