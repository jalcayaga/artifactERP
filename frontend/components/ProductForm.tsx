// components/ProductForm.tsx
import React, { useState, useEffect, FormEvent, useMemo } from 'react'
import { Product } from '@/lib/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  ArchiveBoxIcon,
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  CalculatorIcon,
} from '@/components/Icons'
import { UploadService } from '@/lib/services/uploadService'
import { ProductService } from '@/lib/services/productService'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrencyChilean } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductFormProps {
  productData: Product | null
  onSave: (product: Product, technicalSheetFile: File | null) => void
  onCancel: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({
  productData,
  onSave,
  onCancel,
}) => {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [productType, setProductType] = useState<'PRODUCT' | 'SERVICE'>(
    'PRODUCT'
  )
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('') // This will store price WITHOUT VAT
  const [unitPrice, setUnitPrice] = useState('')
  const [reorderLevel, setReorderLevel] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [technicalSheetFile, setTechnicalSheetFile] = useState<File | null>(
    null
  )
  const [existingTechnicalSheetUrl, setExistingTechnicalSheetUrl] = useState<
    string | null
  >(null)
  const [isPublished, setIsPublished] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [profitMargin, setProfitMargin] = useState('30')
  const [averageCost, setAverageCost] = useState<number | null>(null)

  const priceWithVat = useMemo(() => {
    const priceNum = parseFloat(price)
    if (isNaN(priceNum)) return 0
    return priceNum * 1.19
  }, [price])

  useEffect(() => {
    if (productData) {
      setName(productData.name)
      setProductType(productData.productType)
      setSku(productData.sku || '')
      setDescription(productData.description || '')
      setLongDescription(productData.longDescription || '')
      setCategory(productData.category || '')
      setPrice(productData.price.toString()) // price from DB is without VAT
      setUnitPrice(productData.unitPrice?.toString() || '')
      setReorderLevel(productData.reorderLevel?.toString() || '')
      setImages(productData.images || [])
      setExistingTechnicalSheetUrl(productData.technicalSheetUrl || null)
      setIsPublished(productData.isPublished)

      if (productData.id) {
        ProductService.getAverageCost(productData.id, token!).then((data) => {
          setAverageCost(data.averageCost)
        })
      }
    } else {
      // Reset form for new product
      setName('')
      setProductType('PRODUCT')
      setSku('')
      setDescription('')
      setLongDescription('')
      setCategory('')
      setPrice('')
      setUnitPrice('')
      setReorderLevel('')
      setImages([])
      setNewImages([])
      setTechnicalSheetFile(null)
      setExistingTechnicalSheetUrl(null)
      setIsPublished(true)
      setAverageCost(null)
    }
    setErrors({})
  }, [productData, token])

  const handleSuggestPrice = () => {
    const cost = parseFloat(unitPrice)
    if (isNaN(cost) || cost <= 0) {
      toast.error(
        'Por favor, ingrese un costo unitario válido para calcular el precio sugerido.'
      )
      return
    }

    const margin = parseFloat(profitMargin) / 100
    if (isNaN(margin)) {
      toast.error('Por favor, ingrese un margen de utilidad válido.')
      return
    }

    const suggestedPriceWithoutVat = cost * (1 + margin)
    setPrice(suggestedPriceWithoutVat.toFixed(2))
    toast.success('Precio de venta sugerido (sin IVA) ha sido calculado.')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages((prev) => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const handleTechnicalSheetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setTechnicalSheetFile(e.target.files[0])
    }
  }

  const handleRemoveExistingImage = async (index: number) => {
    const imageUrlToRemove = images[index]
    const filename = imageUrlToRemove.split('/').pop()
    if (filename && token) {
      try {
        await UploadService.deleteImage(filename)
        setImages((prev) => prev.filter((_, i) => i !== index))
      } catch (error) {
        console.error('Error deleting image from backend:', error)
      }
    }
  }

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveTechnicalSheet = async () => {
    if (productData && productData.id && token) {
      try {
        await ProductService.deleteTechnicalSheet(productData.id, token)
        setExistingTechnicalSheetUrl(null)
        setTechnicalSheetFile(null)
      } catch (error) {
        console.error('Error deleting technical sheet:', error)
        setErrors((prev) => ({
          ...prev,
          technicalSheet: 'Error al eliminar la ficha técnica.',
        }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!name.trim()) newErrors.name = 'El nombre es requerido.'
    if (!productType) newErrors.type = 'El tipo es requerido.'
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0)
      newErrors.price = 'El precio de venta debe ser un número positivo o cero.'
    if (unitPrice.trim()) {
      const unitPriceNum = parseFloat(unitPrice)
      if (isNaN(unitPriceNum) || unitPriceNum < 0)
        newErrors.unitPrice =
          'El precio de costo debe ser un número positivo o cero.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    let uploadedImageUrls: string[] = []
    if (newImages.length > 0) {
      try {
        const uploadPromises = newImages.map((image) =>
          UploadService.uploadImage(image)
        )
        const results = await Promise.all(uploadPromises)
        uploadedImageUrls = results.map((result) => result.url)
      } catch (uploadError) {
        console.error('Error uploading new images:', uploadError)
        setErrors({ images: 'Error al subir las nuevas imágenes.' })
        return
      }
    }

    const payload: any = {
      id: productData?.id,
      name: name.trim(),
      productType,
      sku: sku.trim() || undefined,
      description: description.trim() || undefined,
      longDescription: longDescription.trim() || undefined,
      category: category.trim() || undefined,
      price: parseFloat(price), // price is without VAT
      unitPrice: unitPrice.trim() ? parseFloat(unitPrice) : undefined,
      reorderLevel: reorderLevel.trim()
        ? parseInt(reorderLevel, 10)
        : undefined,
      isPublished,
      images: [...images, ...uploadedImageUrls],
      technicalSheetUrl: existingTechnicalSheetUrl,
    }

    onSave(payload, technicalSheetFile)
  }

  const inputBaseClass =
    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground'
  const selectBaseClass = `${inputBaseClass} pr-8`
  const errorTextClass = 'mt-1 text-xs text-destructive'

  return (
    <Card className='max-w-3xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center'>
          <ArchiveBoxIcon className='w-6 h-6 mr-2 text-primary' />
          {productData
            ? `Editar: ${productData.name}`
            : 'Nuevo Producto/Servicio'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-5 pt-6'>
          {/* --- All Original Form Fields --- */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label
                htmlFor='prod-name'
                className='block text-sm font-medium text-foreground'
              >
                Nombre <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='prod-name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputBaseClass}
              />
            </div>
            <div>
              <label
                htmlFor='prod-type'
                className='block text-sm font-medium text-foreground'
              >
                Tipo <span className='text-red-500'>*</span>
              </label>
              <select
                id='prod-type'
                value={productType}
                onChange={(e) =>
                  setProductType(e.target.value as 'PRODUCT' | 'SERVICE')
                }
                className={selectBaseClass}
              >
                <option value='PRODUCT'>Producto</option>
                <option value='SERVICE'>Servicio</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor='prod-description'
              className='block text-sm font-medium text-foreground'
            >
              Descripción Corta
            </label>
            <textarea
              id='prod-description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputBaseClass}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor='prod-long-description'
              className='block text-sm font-medium text-foreground'
            >
              Descripción Larga
            </label>
            <textarea
              id='prod-long-description'
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={4}
              className={inputBaseClass}
            ></textarea>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label
                htmlFor='prod-sku'
                className='block text-sm font-medium text-foreground'
              >
                SKU
              </label>
              <input
                type='text'
                id='prod-sku'
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={inputBaseClass}
              />
            </div>
            <div>
              <label
                htmlFor='prod-category'
                className='block text-sm font-medium text-foreground'
              >
                Categoría
              </label>
              <input
                type='text'
                id='prod-category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label
                htmlFor='prod-unit-price'
                className='block text-sm font-medium text-foreground'
              >
                Precio Costo (sin IVA)
              </label>
              <input
                type='number'
                id='prod-unit-price'
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className={inputBaseClass}
                placeholder='0.00'
                step='0.01'
              />
              {errors.unitPrice && (
                <p className={errorTextClass}>{errors.unitPrice}</p>
              )}
            </div>
            <div className='bg-muted/50 p-3 rounded-lg'>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Sugerencia de Precio
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                  className={`${inputBaseClass} w-20 text-center`}
                  placeholder='30'
                />
                <span className='text-sm text-muted-foreground'>
                  % de Utilidad
                </span>
                <button
                  type='button'
                  onClick={handleSuggestPrice}
                  disabled={!unitPrice || parseFloat(unitPrice) <= 0}
                  className='px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <CalculatorIcon className='w-5 h-5' />
                </button>
              </div>
              {averageCost !== null && (
                <p className='text-xs text-muted-foreground mt-2'>
                  Costo Promedio Actual: {formatCurrencyChilean(averageCost)}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label
                htmlFor='prod-price'
                className='block text-sm font-medium text-foreground'
              >
                Precio Venta (sin IVA) <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                id='prod-price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputBaseClass}
                placeholder='0.00'
                step='0.01'
              />
              {errors.price && <p className={errorTextClass}>{errors.price}</p>}
              <p className='text-xs text-muted-foreground mt-1'>
                Precio con IVA (19%): {formatCurrencyChilean(priceWithVat)}
              </p>
            </div>
            <div>
              <label
                htmlFor='prod-reorder-level'
                className='block text-sm font-medium text-foreground'
              >
                Stock Mínimo
              </label>
              <input
                type='number'
                id='prod-reorder-level'
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                className={inputBaseClass}
                placeholder='0'
              />
            </div>
          </div>

          {/* --- Image Upload Section --- */}
          <div>
            <label
              htmlFor='prod-images'
              className='block text-sm font-medium text-foreground'
            >
              Imágenes
            </label>
            <input
              type='file'
              id='prod-images'
              multiple
              accept='image/*'
              onChange={handleImageChange}
              className='mt-1 block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
            />
            <div className='mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
              {images.map((image, index) => (
                <div key={image} className='relative group'>
                  <img
                    src={image}
                    alt={`Producto ${index + 1}`}
                    className='w-full h-24 object-cover rounded-md'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveExistingImage(index)}
                    className='absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity'
                    title='Eliminar imagen existente'
                  >
                    X
                  </button>
                </div>
              ))}
              {newImages.map((image, index) => (
                <div key={image.name} className='relative group'>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Nueva imagen ${index + 1}`}
                    className='w-full h-24 object-cover rounded-md'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveNewImage(index)}
                    className='absolute top-1 right-1 bg-destructive/80 text-destructive-foreground rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity'
                    title='Eliminar nueva imagen'
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- Technical Sheet Upload Section --- */}
          <div>
            <label className='block text-sm font-medium text-foreground'>
              Ficha Técnica (PDF)
            </label>
            {existingTechnicalSheetUrl ? (
              <div className='flex items-center gap-3 mt-2'>
                <DocumentTextIcon className='w-5 h-5 text-muted-foreground' />
                <a
                  href={`http://localhost:3001${existingTechnicalSheetUrl}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm font-medium text-primary hover:underline'
                >
                  Ver Ficha Actual
                </a>
                <button
                  type='button'
                  onClick={handleRemoveTechnicalSheet}
                  className='text-destructive hover:text-destructive/80 p-1 rounded-md'
                  title='Quitar Ficha Técnica'
                >
                  <TrashIcon className='w-4 h-4' />
                </button>
              </div>
            ) : null}
            <input
              type='file'
              id='prod-technical-sheet'
              accept='application/pdf'
              onChange={handleTechnicalSheetChange}
              className='mt-2 block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
            />
            {technicalSheetFile && (
              <p className='mt-2 text-sm text-muted-foreground'>
                Nuevo archivo seleccionado: {technicalSheetFile.name}
              </p>
            )}
            {errors.technicalSheet && (
              <p className={errorTextClass}>{errors.technicalSheet}</p>
            )}
          </div>

          <div className='flex items-center pt-2'>
            <input
              id='prod-isPublished'
              type='checkbox'
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className='h-4 w-4 text-primary border-border rounded focus:ring-primary'
            />
            <label
              htmlFor='prod-isPublished'
              className='ml-2 block text-sm text-foreground'
            >
              Publicado (visible en tienda/catálogo)
            </label>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-end items-center gap-3 pt-6'>
          <button
            type='button'
            onClick={onCancel}
            className='w-full sm:w-auto order-2 sm:order-1 px-4 py-2.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors duration-150'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2'
          >
            <PlusIcon className='w-5 h-5' />
            <span>{productData ? 'Actualizar' : 'Guardar'}</span>
          </button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ProductForm
