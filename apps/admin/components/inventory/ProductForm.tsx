import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { Product, formatCurrencyChilean, cn } from '@artifact/core';
import { UploadService, ProductService, useAuth } from '@artifact/core/client';
import {
  Card,
  CardContent,
} from '@artifact/ui';
import {
  Archive,
  Plus,
  FileText,
  Trash2,
  Calculator,
  Image as ImageIcon,
  Check,
  X,
  Upload,
  ChevronDown,
  DollarSign,
  Pencil,
  AlertTriangle,
  Eye,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import {
  Button,
  IconButton,
  Typography
} from "@material-tailwind/react";
import { toast } from 'sonner';

interface ProductFormProps {
  productData: Product | null;
  onSave: (product: Product, technicalSheetFile: File | null) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productData,
  onSave,
  onCancel,
}) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [productType, setProductType] = useState<'PRODUCT' | 'SERVICE'>(
    'PRODUCT'
  );
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [technicalSheetFile, setTechnicalSheetFile] = useState<File | null>(null);
  const [existingTechnicalSheetUrl, setExistingTechnicalSheetUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [profitMargin, setProfitMargin] = useState('30');
  const [averageCost, setAverageCost] = useState<number | null>(null);

  const priceWithVat = useMemo(() => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) return 0;
    return priceNum * 1.19;
  }, [price]);

  useEffect(() => {
    if (productData) {
      setName(productData.name);
      setProductType(productData.productType);
      setSku(productData.sku || '');
      setDescription(productData.description || '');
      setLongDescription(productData.longDescription || '');
      setCategory(productData.category || '');
      setPrice(productData.price.toString());
      setUnitPrice(productData.unitPrice?.toString() || '');
      setReorderLevel(productData.reorderLevel?.toString() || '');
      setImages(productData.images || []);
      setExistingTechnicalSheetUrl(productData.technicalSheetUrl || null);
      setIsPublished(productData.isPublished);

      if (productData.id && token) {
        ProductService.getAverageCost(productData.id, token).then((data) => {
          setAverageCost(data.averageCost);
        });
      }
    } else {
      setName('');
      setProductType('PRODUCT');
      setSku('');
      setDescription('');
      setLongDescription('');
      setCategory('');
      setPrice('');
      setUnitPrice('');
      setReorderLevel('');
      setImages([]);
      setNewImages([]);
      setTechnicalSheetFile(null);
      setExistingTechnicalSheetUrl(null);
      setIsPublished(true);
      setAverageCost(null);
    }
    setErrors({});
  }, [productData, token]);

  const handleSuggestPrice = () => {
    const cost = parseFloat(unitPrice);
    if (isNaN(cost) || cost <= 0) {
      toast.error(
        'Por favor, ingrese un costo unitario válido para calcular el precio sugerido.'
      );
      return;
    }

    const margin = parseFloat(profitMargin) / 100;
    if (isNaN(margin)) {
      toast.error('Por favor, ingrese un margen de utilidad válido.');
      return;
    }

    const suggestedPriceWithoutVat = cost * (1 + margin);
    setPrice(suggestedPriceWithoutVat.toFixed(2));
    toast.success('Precio de venta sugerido (sin IVA) ha sido calculado.');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleTechnicalSheetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setTechnicalSheetFile(e.target.files[0]);
    }
  };

  const handleRemoveExistingImage = async (index: number) => {
    const imageUrlToRemove = images[index];
    const filename = imageUrlToRemove.split('/').pop();
    if (filename && token) {
      try {
        await UploadService.deleteImage(filename);
        setImages((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting image from backend:', error);
      }
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveTechnicalSheet = async () => {
    if (productData && productData.id && token) {
      try {
        await ProductService.deleteTechnicalSheet(productData.id, token);
        setExistingTechnicalSheetUrl(null);
        setTechnicalSheetFile(null);
      } catch (error) {
        console.error('Error deleting technical sheet:', error);
        setErrors((prev) => ({
          ...prev,
          technicalSheet: 'Error al eliminar la ficha técnica.',
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido.';
    if (!productType) newErrors.type = 'El tipo es requerido.';
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0)
      newErrors.price = 'El precio de venta debe ser un número positivo o cero.';
    if (unitPrice.trim()) {
      const unitPriceNum = parseFloat(unitPrice);
      if (isNaN(unitPriceNum) || unitPriceNum < 0)
        newErrors.unitPrice =
          'El precio de costo debe ser un número positivo o cero.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let uploadedImageUrls: string[] = [];
    if (newImages.length > 0) {
      try {
        const uploadPromises = newImages.map((image) =>
          UploadService.uploadImage(image)
        );
        const results = await Promise.all(uploadPromises);
        uploadedImageUrls = results.map((result) => result.url);
      } catch (uploadError) {
        console.error('Error uploading new images:', uploadError);
        setErrors({ images: 'Error al subir las nuevas imágenes.' });
        return;
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
      price: parseFloat(price),
      unitPrice: unitPrice.trim() ? parseFloat(unitPrice) : undefined,
      reorderLevel: reorderLevel.trim()
        ? parseInt(reorderLevel, 10)
        : undefined,
      isPublished,
      images: [...images, ...uploadedImageUrls],
      technicalSheetUrl: existingTechnicalSheetUrl,
    };

    try {
      await onSave(payload, technicalSheetFile);
    } catch (err: any) {
      console.error('Error saving product from form:', err);
      toast.error(err.message || 'Error al guardar el producto.');
    }
  };

  const inputBaseClass =
    'block w-full px-4 py-2.5 bg-slate-900/50 border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium';
  const labelClass = 'block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1';
  const errorTextClass = 'mt-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1';

  return (
    <Card className='max-w-5xl mx-auto border-white/[0.05] bg-[#1a2537]/60 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border'>
      {/* Glossy Header */}
      <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
        <div className="flex items-center gap-6 z-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 relative">
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm scale-90" />
            <Archive className='w-7 h-7 text-white italic relative' />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
              {productData ? `Refinar Registro` : 'Nueva Incorporación'}
              {sku && <span className="text-blue-500 opacity-50 text-sm font-black not-italic ml-2">#{sku}</span>}
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
              {productData ? `Sincronizando: ${productData.name}` : 'Módulo de Registro de Activos y Servicios'}
            </p>
          </div>
        </div>
        <IconButton variant="text" color="blue-gray" onClick={onCancel} placeholder=""  className="rounded-full hover:bg-white/5">
          <X className="h-6 w-6 text-slate-400" />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Essential Info */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.03]">
                <Plus className="w-4 h-4 text-blue-500" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Capa de Información Base</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor='prod-name' className={labelClass}>Identificador Nominal <span className='text-red-500 opacity-50'>*</span></label>
                  <input
                    type='text'
                    id='prod-name'
                    placeholder="Especifique el nombre comercial del ítem..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputBaseClass}
                  />
                  {errors.name && <p className={errorTextClass}>{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor='prod-type' className={labelClass}>Clasificación Logística</label>
                    <div className="relative group">
                      <select
                        id='prod-type'
                        value={productType}
                        onChange={(e) => setProductType(e.target.value as 'PRODUCT' | 'SERVICE')}
                        className={`${inputBaseClass} appearance-none pr-12 cursor-pointer z-10 relative bg-transparent`}
                      >
                        <option value='PRODUCT'>📦 Ítem Inventariable (Producto)</option>
                        <option value='SERVICE'>⚡ Ejecución Activa (Servicio)</option>
                      </select>
                      <div className="absolute inset-0 bg-slate-950/40 rounded-2xl border border-white/[0.08]" />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none z-20 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor='prod-sku' className={labelClass}>Referencia / SKU</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">#</div>
                      <input
                        type='text'
                        id='prod-sku'
                        placeholder="SKU-MASTER-00X"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className={`${inputBaseClass} pl-10 font-mono uppercase text-blue-400 placeholder:opacity-30`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor='prod-category' className={labelClass}>Agrupación de Catálogo</label>
                  <input
                    type='text'
                    id='prod-category'
                    placeholder="Arquitectura, Licenciamiento, Hardware..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.03]">
                <FileText className="w-4 h-4 text-blue-500" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Descriptores y Narrativa</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor='prod-description' className={labelClass}>Resumen para Documentos</label>
                  <textarea
                    id='prod-description'
                    placeholder="Esta descripción aparecerá en facturas y cotizaciones..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className={`${inputBaseClass} resize-none min-h-[80px] leading-relaxed`}
                  />
                </div>

                <div>
                  <label htmlFor='prod-long-description' className={labelClass}>Ficha de Producto (Detallada)</label>
                  <textarea
                    id='prod-long-description'
                    placeholder="Información técnica extendida, garantías y especificaciones..."
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    rows={4}
                    className={`${inputBaseClass} resize-none min-h-[140px] leading-relaxed`}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Pricing & Media */}
          <div className="lg:col-span-5 space-y-10">
            <section className="space-y-8 bg-white/[0.01] p-8 rounded-[2rem] border border-white/[0.03] shadow-inner">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.05]">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Cálculo de Rentabilidad</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor='prod-unit-price' className={labelClass}>Costo Unitario Neto</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-lg bg-slate-900 flex items-center justify-center border border-white/10 group-focus-within:border-blue-500/50 transition-colors">
                        <span className="text-[10px] font-black text-slate-500">$</span>
                      </div>
                      <input
                        type='number'
                        id='prod-unit-price'
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        className={`${inputBaseClass} pl-12 text-blue-200`}
                        placeholder='0'
                        step='0.01'
                      />
                    </div>
                  </div>

                  <div className='relative group h-full flex flex-col justify-end'>
                    <div className='bg-blue-600/5 border border-blue-500/10 p-4 rounded-2xl relative overflow-hidden h-full flex flex-col justify-center'>
                      {averageCost !== null && (
                        <div className='flex flex-col gap-1'>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Costo Histórico</p>
                          <span className="text-sm font-black text-blue-400 italic">{formatCurrencyChilean(averageCost)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='p-6 rounded-[1.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 shadow-xl relative overflow-hidden group/calc'>
                  <div className="absolute -top-4 -right-4 h-24 w-24 bg-blue-600/5 rounded-full blur-3xl group-hover/calc:scale-150 transition-transform duration-700" />
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Proyección de Utilidad</label>
                    <Calculator className="w-4 h-4 text-blue-500 opacity-40" />
                  </div>
                  <div className='flex items-stretch gap-3'>
                    <div className="relative flex-1">
                      <input
                        type='number'
                        value={profitMargin}
                        onChange={(e) => setProfitMargin(e.target.value)}
                        className={`${inputBaseClass} text-center py-2.5 pr-8 bg-slate-950/60`}
                        placeholder='30'
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500">%</span>
                    </div>
                    <Button
                      variant="filled"
                      size="sm"
                      onClick={handleSuggestPrice}
                      disabled={!unitPrice || parseFloat(unitPrice) <= 0}
                      className="rounded-xl px-5 bg-blue-600 shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
                      placeholder=""
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <Check className='w-4 h-4 font-black' strokeWidth={3} />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 space-y-6">
                  <div>
                    <label htmlFor='prod-price' className={labelClass}>Precio de Venta (Neto) <span className='text-red-500'>*</span></label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-focus-within:scale-110 transition-transform">
                        <span className="text-xs font-black text-white">$</span>
                      </div>
                      <input
                        type='number'
                        id='prod-price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`${inputBaseClass} pl-16 border-emerald-500/40 text-lg font-black text-white focus:ring-emerald-500/30`}
                        placeholder='0.00'
                        step='0.01'
                      />
                    </div>
                    {errors.price && <p className={errorTextClass}>{errors.price}</p>}
                    <div className="mt-4 flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Precio Final al Público <br /><span className="text-[8px] opacity-60">(Impuestos Incluidos)</span></span>
                      <span className="text-lg font-black text-white italic tracking-tight">{formatCurrencyChilean(priceWithVat)}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor='prod-reorder-level' className={labelClass}>Umbral Crítico de Stock</label>
                    <div className="relative">
                      <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
                      <input
                        type='number'
                        id='prod-reorder-level'
                        value={reorderLevel}
                        onChange={(e) => setReorderLevel(e.target.value)}
                        className={`${inputBaseClass} pl-12 border-orange-500/20 focus:ring-orange-500/30`}
                        placeholder='0'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.03]">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Multimedia y Activos</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="relative group overflow-hidden rounded-[1.5rem]">
                    <input
                      type='file'
                      id='prod-images'
                      multiple
                      accept='image/*'
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="prod-images"
                      className="flex items-center gap-6 p-5 border border-dashed border-white/10 rounded-[1.5rem] bg-slate-900/40 hover:bg-white/[0.02] hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">
                        <Upload className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">Adjuntar Visuales</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">JPG, PNG, WEBP (Hasta 6 archivos)</span>
                      </div>
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Plus className="w-16 h-16" />
                      </div>
                    </label>
                  </div>

                  <div className='grid grid-cols-3 gap-3'>
                    {[...images, ...newImages.map(f => URL.createObjectURL(f))].slice(0, 6).map((img, i) => (
                      <div key={i} className='relative aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-lg'>
                        <img src={img} alt="Preview" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                          <button
                            type='button'
                            onClick={() => i < images.length ? handleRemoveExistingImage(i) : handleRemoveNewImage(i - images.length)}
                            className='px-3 py-1.5 bg-red-600 rounded-lg shadow-xl hover:bg-red-500 transition-colors'
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-950/40 rounded-[1.5rem] border border-white/5 relative group overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Documentación Técnica</span>
                    </div>
                    <div className="relative">
                      <input
                        type='file'
                        id='prod-technical-sheet'
                        accept='application/pdf'
                        onChange={handleTechnicalSheetChange}
                        className="hidden"
                      />
                      <label htmlFor="prod-technical-sheet" className="cursor-pointer">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors">
                          <Plus className="h-4 w-4 text-white" />
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-[#0a0f18] p-3 rounded-xl border border-white/[0.03]">
                    <div className="flex-1 min-w-0">
                      {technicalSheetFile ? (
                        <div className="text-[11px] font-black text-white truncate flex items-center gap-2">
                          <div className="h-1 w-1 bg-blue-500 rounded-full animate-pulse" />
                          {technicalSheetFile.name}
                        </div>
                      ) : existingTechnicalSheetUrl ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}${existingTechnicalSheetUrl}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-[11px] font-black text-blue-400 hover:text-blue-300 transition-colors truncate flex items-center gap-2 group/link'
                        >
                          Ficha_Tecnica_Sincronizada.pdf
                          <Eye className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-all font-black" />
                        </a>
                      ) : (
                        <div className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">No vinculada</div>
                      )}
                    </div>
                    {(technicalSheetFile || existingTechnicalSheetUrl) && (
                      <button
                        type="button"
                        onClick={handleRemoveTechnicalSheet}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Action Belt */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 p-3 bg-white/[0.02] rounded-[1.5rem] border border-white/[0.05] pr-8">
            <div className="flex items-center gap-4 px-3">
              <div
                className={`w-14 h-7 rounded-full p-1.5 cursor-pointer transition-all duration-500 relative flex items-center ${isPublished ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800'}`}
                onClick={() => setIsPublished(!isPublished)}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-500 transform ${isPublished ? 'translate-x-7 rotate-[360deg]' : 'translate-x-0'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Visibilidad Global</span>
                <span className={`text-[9px] font-bold uppercase mt-1 tracking-wider ${isPublished ? 'text-blue-400' : 'text-slate-600'}`}>
                  {isPublished ? 'Activo en Catálogo' : 'Modo Borrador / Oculto'}
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-white/5" />

            <div className="flex items-center gap-3 pl-3">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em] leading-tight">Módulo de <br />Seguridad Interna</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              variant="text"
              className="px-8 py-4 text-slate-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.25em]"
              onClick={onCancel}
              placeholder=""
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Interrumpir Proceso
            </Button>
            <Button
              type='submit'
              className='flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-12 rounded-2xl shadow-2xl shadow-blue-600/30 active:scale-95 transition-all text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-4 group relative overflow-hidden'
              placeholder=""
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {productData ? <RefreshCcw className="h-5 w-5 font-black animate-spin-slow" /> : <Plus className="h-5 w-5 font-black" strokeWidth={3} />}
              <span>{productData ? 'Firmar y Sincronizar' : 'Registrar en Catálogo'}</span>
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;
