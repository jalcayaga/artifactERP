// frontend/components/ProductManagementView.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProductService } from '@/lib/services/productService';
import { Product, CreateProductDto, UpdateProductDto, ProductType, UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PencilIcon, TrashIcon, PlusIcon } from '@/components/Icons';

const ProductManagementView: React.FC = () => {
  const { token, isAuthenticated, currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState<Partial<CreateProductDto>>({
    name: '',
    productType: 'PRODUCT',
    sku: '',
    description: '',
    longDescription: '',
    images: [],
    category: '',
    price: 0,
    unitPrice: 0,
    reorderLevel: 0,
    isPublished: false,
  });

  const fetchProducts = useCallback(async (page: number = 1) => {
    if (!isAuthenticated || !token || currentUser?.role !== UserRole.ADMIN) {
      setError('No autorizado para ver esta página.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts(token, page);
      setProducts(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.currentPage);
      setTotalProducts(response.total);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, currentUser]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: parseFloat(value) });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormValues({ ...formValues, isPublished: checked });
  };

  const handleSelectChange = (value: string) => {
    setFormValues({ ...formValues, productType: value as ProductType });
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormValues({
        name: product.name,
        productType: product.productType,
        sku: product.sku || '',
        description: product.description || '',
        longDescription: product.longDescription || '',
        images: product.images || [],
        category: product.category || '',
        price: product.price,
        unitPrice: product.unitPrice || 0,
        
        reorderLevel: product.reorderLevel || 0,
        isPublished: product.isPublished,
      });
    } else {
      setEditingProduct(null);
      setFormValues({
        name: '',
        productType: 'PRODUCT',
        sku: '',
        description: '',
        longDescription: '',
        images: [],
        category: '',
        price: 0,
        unitPrice: 0,
        
        reorderLevel: 0,
        isPublished: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload: any = { ...formValues };
    if (formValues.productType !== 'PRODUCT') {
      delete payload.currentStock;
      delete payload.reorderLevel;
    }

    try {
      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id, payload as UpdateProductDto, token);
      } else {
        await ProductService.createProduct(payload as CreateProductDto, token);
      }
      setIsModalOpen(false);
      fetchProducts(currentPage);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Error al guardar el producto.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!token || !window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      await ProductService.deleteProduct(productId, token);
      fetchProducts(currentPage);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error al eliminar el producto.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-foreground">Gestión de Productos</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenModal()}><PlusIcon className="mr-2 h-4 w-4" /> Añadir Producto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" value={formValues.name} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productType" className="text-right">Tipo</Label>
                <Select onValueChange={handleSelectChange} value={formValues.productType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {['PRODUCT', 'SERVICE'].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">SKU</Label>
                <Input id="sku" value={formValues.sku} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right">Descripción Corta</Label>
                <Textarea id="description" value={formValues.description} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="longDescription" className="text-right">Descripción Larga</Label>
                <Textarea id="longDescription" value={formValues.longDescription} onChange={handleInputChange} className="col-span-3" rows={5} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="images" className="text-right">Imágenes (URLs separadas por coma)</Label>
                <Input id="images" value={formValues.images?.join(',') || ''} onChange={(e) => setFormValues({ ...formValues, images: e.target.value.split(',').map(img => img.trim()) })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Categoría</Label>
                <Input id="category" value={formValues.category} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Precio</Label>
                <Input id="price" type="number" value={formValues.price} onChange={handleNumberInputChange} className="col-span-3" required step="0.01" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unitPrice" className="text-right">Precio Unitario</Label>
                <Input id="unitPrice" type="number" value={formValues.unitPrice} onChange={handleNumberInputChange} className="col-span-3" step="0.01" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reorderLevel" className="text-right">Nivel de Reorden</Label>
                <Input id="reorderLevel" type="number" value={formValues.reorderLevel} onChange={handleNumberInputChange} className="col-span-3" step="1" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isPublished" className="text-right">Publicado</Label>
                <Checkbox id="isPublished" checked={formValues.isPublished} onCheckedChange={handleCheckboxChange} className="col-span-3" />
              </div>
              <DialogFooter>
                <Button type="submit">{editingProduct ? 'Guardar Cambios' : 'Añadir Producto'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                
                <TableHead>Publicado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.productType}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  
                  <TableCell>{product.isPublished ? 'Sí' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(product)} className="mr-2">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} (Total: {totalProducts} productos)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagementView;