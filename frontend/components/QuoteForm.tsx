import React, { useState, useEffect, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TrashIcon, PlusIcon } from '@/components/Icons'
import { Company, Product, Quote, QuoteStatus } from '@/lib/types'
import { CompanyService } from '@/lib/services/companyService'
import { ProductService } from '@/lib/services/productService'
import { formatCurrencyChilean, parseChileanCurrency } from '@/lib/utils'

const formSchema = z.object({
  companyId: z.string().min(1, 'La empresa es requerida.'),
  status: z.nativeEnum(QuoteStatus),
  quoteDate: z.string().min(1, 'La fecha es requerida.'),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'El producto es requerido.'),
        quantity: z.number().min(1, 'La cantidad debe ser al menos 1.'),
        unitPrice: z.number(),
        totalPrice: z.number(),
        itemVatAmount: z.number(),
        totalPriceWithVat: z.number(),
      })
    )
    .min(1, 'Debe haber al menos un ítem en la cotización.'),
  subTotalAmount: z.number(),
  vatAmount: z.number(),
  grandTotal: z.number(),
})

type QuoteFormValues = z.infer<typeof formSchema>

interface QuoteFormProps {
  quoteData?: Quote | null
  onSave: (data: QuoteFormValues) => void
  onCancel: () => void
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  quoteData,
  onSave,
  onCancel,
}) => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: quoteData
      ? {
          companyId: quoteData.companyId,
          status: quoteData.status,
          quoteDate: quoteData.quoteDate
            ? new Date(quoteData.quoteDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          expiryDate: quoteData.expiryDate
            ? new Date(quoteData.expiryDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          items: quoteData.items || [],
          notes: quoteData.notes || '',
        }
      : {
          companyId: '',
          status: QuoteStatus.DRAFT,
          quoteDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date().toISOString().split('T')[0],
          notes: '',
          items: [],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const fetchCompaniesAndProducts = useCallback(async () => {
    try {
      const companyResponse = await CompanyService.getAllCompanies(1, 100, {
        isClient: true,
      })
      setCompanies(companyResponse.data)

      const productResponse = await ProductService.getAllProducts('1', 1000)
      setProducts(productResponse.data)
    } catch (error) {
      console.error('Error fetching companies or products', error)
    }
  }, [])

  useEffect(() => {
    fetchCompaniesAndProducts()
  }, [fetchCompaniesAndProducts])

  const calculateTotals = useCallback(() => {
    const items = form.getValues('items')
    let subTotal = 0
    items.forEach((item, index) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        const unitPrice = parseFloat(
          (form.getValues(`items.${index}.unitPrice`) as any) ||
            (product.price as any)
        )
        const quantity = item.quantity
        const totalPrice = unitPrice * quantity
        const vatAmount = totalPrice * 0.19
        const totalPriceWithVat = totalPrice + vatAmount

        form.setValue(`items.${index}.totalPrice`, totalPrice, {
          shouldValidate: true,
        })
        form.setValue(`items.${index}.itemVatAmount`, vatAmount, {
          shouldValidate: true,
        })
        form.setValue(`items.${index}.totalPriceWithVat`, totalPriceWithVat, {
          shouldValidate: true,
        })

        subTotal += totalPrice
      }
    })

    const vatTotal = subTotal * 0.19
    const grandTotal = subTotal + vatTotal

    form.setValue('subTotalAmount', subTotal, { shouldValidate: true })
    form.setValue('vatAmount', vatTotal, { shouldValidate: true })
    form.setValue('grandTotal', grandTotal, { shouldValidate: true })
  }, [form, products])

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name?.startsWith('items')) {
        calculateTotals()
      }
    })
    return () => subscription.unsubscribe()
  }, [form, calculateTotals])

  const onSubmit = (data: QuoteFormValues) => {
    onSave(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle>
              {quoteData ? 'Editar Cotización' : 'Crear Cotización'}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='companyId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione una empresa' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies &&
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione un estado' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(QuoteStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='quoteDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Cotización</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='expiryDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Notas adicionales sobre la cotización'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ítems de la Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-center'
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          const product = products.find((p) => p.id === value)
                          form.setValue(
                            `items.${index}.unitPrice`,
                            parseFloat((product?.price as any) || '0')
                          )
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccione un producto' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        type='number'
                        placeholder='Cantidad'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        type='text'
                        placeholder='Precio Unit.'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseChileanCurrency(e.target.value))
                        }
                        value={formatCurrencyChilean(field.value)}
                      />
                    </FormItem>
                  )}
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => remove(index)}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                append({
                  productId: '',
                  quantity: 1,
                  unitPrice: 0,
                  totalPrice: 0,
                  itemVatAmount: 0,
                  totalPriceWithVat: 0,
                })
              }
            >
              <PlusIcon className='w-4 h-4 mr-2' />
              Añadir Ítem
            </Button>
          </CardContent>
        </Card>

        <div className='flex justify-end space-x-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
          <Button type='submit'>Guardar Cotización</Button>
        </div>
      </form>
    </Form>
  )
}

export default QuoteForm
