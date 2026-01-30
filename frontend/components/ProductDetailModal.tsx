// components/ProductDetailModal.tsx
import React, { useEffect, useState } from 'react'
import { Product, Lot } from '@/lib/types'
import {
  XIcon,
  CubeIcon,
  ArchiveBoxIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  InboxIcon,
  PencilIcon,
  DocumentTextIcon,
} from '@/components/Icons'
import { formatCurrencyChilean, formatDate } from '@/lib/utils'
import { api } from '@/lib/api'
import LotEditModal from './LotEditModal'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
}

const DetailItem: React.FC<{
  label: string
  value?: string | number | boolean | React.ReactNode
  icon?: React.FC<{ className?: string }>
  isCurrency?: boolean
}> = ({ label, value, icon: Icon, isCurrency = false }) => {
  let displayValue: React.ReactNode

  if (isCurrency && typeof value === 'number') {
    displayValue = formatCurrencyChilean(value)
  } else if (typeof value === 'boolean') {
    displayValue = value ? (
      <span className='flex items-center text-emerald-600 dark:text-emerald-400'>
        <CheckCircleIcon className='w-4 h-4 mr-1.5' /> Sí
      </span>
    ) : (
      <span className='flex items-center text-amber-600 dark:text-amber-400'>
        <XCircleIcon className='w-4 h-4 mr-1.5' /> No
      </span>
    )
  } else if (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    displayValue = <span className='italic text-muted-foreground'>N/A</span>
  } else {
    displayValue = value
  }

  return (
    <div className='flex flex-col sm:flex-row sm:items-start py-2'>
      <dt className='w-full sm:w-2/5 md:w-1/3 text-sm font-medium text-muted-foreground flex items-center'>
        {Icon && <Icon className='w-4 h-4 mr-2 opacity-70 flex-shrink-0' />}
        {label}
      </dt>
      <dd className='w-full sm:w-3/5 md:w-2/3 mt-1 sm:mt-0 text-sm text-foreground break-words'>
        {displayValue}
      </dd>
    </div>
  )
}

import ProductPurchaseHistory from './ProductPurchaseHistory'

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [lots, setLots] = useState<Lot[]>([])
  const [isLoadingLots, setIsLoadingLots] = useState(false)
  const [editingLot, setEditingLot] = useState<Lot | null>(null)

  const handleSaveLot = (updatedLot: Lot) => {
    setLots((prevLots) =>
      prevLots.map((l) => (l.id === updatedLot.id ? updatedLot : l))
    )
  }

  useEffect(() => {
    if (product && product.productType === 'PRODUCT') {
      const fetchLots = async () => {
        setIsLoadingLots(true)
        try {
          const response = await api.get(`/products/${product.id}/lots`)
          setLots(response.data)
        } catch (error) {
          console.error(`Error fetching lots for product ${product.id}:`, error)
          setLots([])
        } finally {
          setIsLoadingLots(false)
        }
      }
      fetchLots()
    }
  }, [product])

  useEffect(() => {
    if (!product) return
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [product, onClose])

  if (!product) return null

  const ProductTypeIcon =
    product.productType === 'PRODUCT' ? CubeIcon : ArchiveBoxIcon

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='product-detail-modal-title'
    >
      <div
        className='bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-start justify-between p-4 sm:p-5 border-b border-border'>
          <div className='flex items-center'>
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className='w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-3 sm:mr-4'
              />
            ) : (
              <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted flex items-center justify-center mr-3 sm:mr-4'>
                <ProductTypeIcon className='w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground' />
              </div>
            )}
            <div>
              <h2
                id='product-detail-modal-title'
                className='text-lg sm:text-xl font-semibold text-foreground leading-tight'
              >
                {product.name}
              </h2>
              <span
                className={`mt-1 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.productType === 'PRODUCT'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary/10 text-secondary-foreground'
                }`}
              >
                {product.productType}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ml-2'
            aria-label='Cerrar modal'
          >
            <XIcon className='w-5 h-5' />
          </button>
        </div>

        <div className='p-4 sm:p-5 space-y-4 overflow-y-auto'>
          <dl className='divide-y divide-border/50'>
            <DetailItem label='SKU' value={product.sku} icon={TagIcon} />
            <DetailItem
              label='Descripción'
              value={
                <p className='whitespace-pre-wrap'>{product.description}</p>
              }
            />
            <DetailItem label='Categoría' value={product.category} />
            <DetailItem
              label='Precio Venta (sin IVA)'
              value={product.price}
              icon={CreditCardIcon}
              isCurrency={true}
            />
            {product.productType === 'PRODUCT' &&
              product.unitPrice !== undefined && (
                <DetailItem
                  label='Precio Costo (sin IVA)'
                  value={product.unitPrice}
                  icon={CreditCardIcon}
                  isCurrency={true}
                />
              )}
            {product.productType === 'PRODUCT' && (
              <DetailItem
                label='Stock Actual'
                value={product.totalStock}
                icon={ArchiveBoxIcon}
              />
            )}
            <DetailItem label='Publicado' value={product.isPublished} />
            {product.longDescription && (
              <DetailItem
                label='Descripción Larga'
                value={
                  <p className='whitespace-pre-wrap'>
                    {product.longDescription}
                  </p>
                }
              />
            )}
            {product.technicalSheetUrl && (
              <DetailItem
                label='Ficha Técnica'
                icon={DocumentTextIcon}
                value={
                  <a
                    href={`http://localhost:3001${product.technicalSheetUrl}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary'
                  >
                    Descargar PDF
                  </a>
                }
              />
            )}
          </dl>

          {product.productType === 'PRODUCT' && (
            <div>
              <h3 className='text-md font-semibold text-foreground mb-2 flex items-center'>
                <InboxIcon className='w-5 h-5 mr-2 opacity-80' />
                Lotes de Stock Activos
              </h3>
              {isLoadingLots ? (
                <p className='text-sm text-muted-foreground'>
                  Cargando lotes...
                </p>
              ) : lots.length > 0 ? (
                <div className='border border-border rounded-lg overflow-hidden'>
                  <ul className='divide-y divide-border/50'>
                    {lots.map((lot) => (
                      <li
                        key={lot.id}
                        className='p-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm'
                      >
                        <div className='font-medium'>
                          #{lot.lotNumber || 'N/A'}
                        </div>
                        <div>
                          <span className='font-semibold'>Cant:</span>{' '}
                          {lot.currentQuantity}
                        </div>
                        <div className='text-muted-foreground'>
                          <span className='font-semibold text-foreground'>
                            Costo:
                          </span>{' '}
                          {formatCurrencyChilean(lot.purchasePrice)}
                        </div>
                        <div className='text-muted-foreground'>
                          <span className='font-semibold text-foreground'>
                            Venc:
                          </span>{' '}
                          {lot.expirationDate
                            ? formatDate(lot.expirationDate)
                            : 'N/A'}
                        </div>
                        <div className='flex items-center justify-end'>
                          <button
                            onClick={() => setEditingLot(lot)}
                            className='p-1 text-muted-foreground hover:text-primary'
                          >
                            <PencilIcon className='w-4 h-4' />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className='text-sm text-muted-foreground italic'>
                  No hay lotes activos para este producto.
                </p>
              )}
            </div>
          )}

          {product.productType === 'PRODUCT' && (
            <div className='mt-4'>
              <ProductPurchaseHistory productId={product.id} />
            </div>
          )}
        </div>

        <div className='px-4 py-3 sm:px-5 bg-muted/50 border-t border-border flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors'
          >
            Cerrar
          </button>
        </div>
      </div>
      {editingLot && (
        <LotEditModal
          lot={editingLot}
          onClose={() => setEditingLot(null)}
          onSave={handleSaveLot}
        />
      )}
    </div>
  )
}

export default ProductDetailModal
