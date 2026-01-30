// frontend/components/ecommerce/CartView.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/lib/types'
import {
  TrashIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
} from '@/components/Icons'
import { formatCurrencyChilean } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CartView: React.FC = () => {
  const { items, removeItem, updateItemQuantity, cartTotal, itemCount } =
    useCart()

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
      <div className='flex flex-col items-center mb-8 md:mb-12'>
        <ShoppingCartIcon className='w-12 h-12 text-primary mb-3' />
        <h1 className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight'>
          Tu Carrito de Compras
        </h1>
      </div>

      {items.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-xl text-muted-foreground mb-4'>
            Tu carrito está vacío.
          </p>
          <Link
            href='/products'
            className='inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300'
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          <div className='lg:col-span-2 space-y-4'>
            {items.map((item: CartItem) => (
              <Card
                key={item.productId}
                className='flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 border transition-shadow hover:shadow-md'
              >
                {item.image && (
                  <Link
                    href={`/products/${item.productId}`}
                    className='flex-shrink-0 self-center sm:self-start'
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-24 h-24 object-cover rounded-md border'
                    />
                  </Link>
                )}
                <div className='flex-grow'>
                  <Link href={`/products/${item.productId}`}>
                    <h3 className='text-md font-semibold text-foreground hover:text-primary transition-colors'>
                      {item.name}
                    </h3>
                  </Link>
                  <p className='text-sm text-primary font-medium'>
                    {formatCurrencyChilean(item.price)} / unidad
                  </p>
                  {item.installationService && (
                    <div className='text-xs text-secondary flex items-center mt-0.5'>
                      <WrenchScrewdriverIcon className='w-3.5 h-3.5 mr-1.5 text-secondary/80' />
                      <span>
                        Servicio de Instalación: +
                        {formatCurrencyChilean(item.installationService.price)}{' '}
                        / unidad
                      </span>
                    </div>
                  )}
                  <div className='flex items-center space-x-2 mt-2'>
                    <label
                      htmlFor={`quantity-${item.productId}`}
                      className='text-xs text-muted-foreground'
                    >
                      Cant:
                    </label>
                    <input
                      type='number'
                      id={`quantity-${item.productId}`}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemQuantity(
                          item.productId,
                          parseInt(e.target.value, 10) || 1
                        )
                      }
                      min='1'
                      className='w-16 px-2 py-1 border border-border rounded-md text-sm bg-transparent focus:ring-1 focus:ring-primary focus:border-primary'
                      aria-label={`Cantidad de ${item.name}`}
                    />
                  </div>
                </div>
                <div className='flex flex-col items-end sm:ml-auto mt-3 sm:mt-0 self-start sm:self-center'>
                  <p className='text-md font-semibold text-foreground mb-2 sm:mb-0'>
                    {formatCurrencyChilean(
                      item.price * item.quantity +
                        (item.installationService
                          ? item.installationService.price * item.quantity
                          : 0)
                    )}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className='text-xs text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10 transition-colors flex items-center mt-1'
                    aria-label={`Eliminar ${item.name} del carrito`}
                  >
                    <TrashIcon className='w-4 h-4 mr-1' /> Eliminar
                  </button>
                </div>
              </Card>
            ))}
            <div className='mt-6 text-left'>
              <Link
                href='/products'
                className='text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70'
              >
                &larr; Seguir Comprando
              </Link>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <Card className='lg:col-span-1 p-6 border sticky top-24 shadow-lg'>
            <CardHeader className='p-0 mb-5'>
              <CardTitle className='text-xl font-semibold text-foreground'>
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0 space-y-3'>
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>Items ({itemCount}):</span>
                <span className='text-foreground'>
                  {formatCurrencyChilean(cartTotal)}
                </span>
              </div>
              {/* <div className="flex justify-between text-sm text-muted-foreground">
                <span>Descuentos:</span>
                <span className="text-emerald-600 dark:text-emerald-400">-{formatCurrencyChilean(0)}</span>
              </div> */}
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>Envío:</span>
                <span className='text-foreground'>
                  A calcular en el checkout
                </span>
              </div>
              <hr className='border-border my-3' />
              <div className='flex justify-between text-lg font-bold text-foreground'>
                <span>Total Estimado:</span>
                <span className='text-primary'>
                  {formatCurrencyChilean(cartTotal)}
                </span>
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Impuestos incluidos. El costo de envío se calculará al finalizar
                la compra.
              </p>
              <Link
                href='/checkout'
                className='mt-6 w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-card'
              >
                <CreditCardIcon className='w-5 h-5 mr-2.5' />
                Proceder al Pago
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CartView
