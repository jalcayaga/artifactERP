'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, OrderSource, Sale, OrderStatus, PaymentStatus, User, PaymentMethod, formatCurrencyChilean, Company } from '@artifact/core';
import { ProductService, SaleService, useAuth, CompanyService, CategoryService } from '@artifact/core/client';
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
    IconButton,
    Badge,
    Tooltip,
    Select,
    Option,
} from '@material-tailwind/react';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    BanknotesIcon,
    TagIcon,
    ArrowsPointingOutIcon,
    ArrowLeftOnRectangleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import CategorySidebar from './CategorySidebar';

interface PosCartItem {
    product: Product;
    quantity: number;
}

const PosView: React.FC = () => {
    const { token, currentUser } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // TODO: Type properly
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<PosCartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [clients, setClients] = useState<any[]>([]);

    // Fetch initial data
    useEffect(() => {
        // Load data immediately, fallback to mock if no token or error
        loadProducts();
        loadClients();
        loadCategories();
    }, [token]);

    const loadClients = async () => {
        if (!token) {
            setClients([
                { id: 'c1', name: 'Walk in Customer' },
                { id: 'c2', name: 'James Anderson' },
            ]);
            return;
        }
        try {
            const res = await CompanyService.getCompanies(token, 1, 100);
            if (res.data && res.data.length > 0) {
                setClients(res.data);
            } else {
                setClients([
                    { id: 'c1', name: 'Walk in Customer' },
                    { id: 'c2', name: 'James Anderson' },
                ]);
            }
        } catch (e) {
            setClients([
                { id: 'c1', name: 'Walk in Customer' },
                { id: 'c2', name: 'James Anderson' },
            ]);
        }
    }

    const loadCategories = async () => {
        if (!token) {
            setCategories([
                { id: '1', name: 'Computadores', slug: 'computadores' },
                { id: '2', name: 'Notebooks', slug: 'notebooks' },
                { id: '3', name: 'Monitores', slug: 'monitores' },
                { id: '4', name: 'Periféricos', slug: 'perifericos' },
                { id: '5', name: 'Componentes', slug: 'componentes' },
                { id: '6', name: 'Sillas Gamer', slug: 'sillas-gamer' },
            ]);
            return;
        }
        try {
            const res = await CategoryService.getAllCategories(token);
            const data = Array.isArray(res) ? res : res.data || [];
            if (data.length > 0) {
                setCategories(data);
            } else {
                throw new Error("No categories found");
            }
        } catch (error) {
            console.warn('Error loading categories, using mock:', error);
            setCategories([
                { id: '1', name: 'Computadores', slug: 'computadores' },
                { id: '2', name: 'Notebooks', slug: 'notebooks' },
                { id: '3', name: 'Monitores', slug: 'monitores' },
                { id: '4', name: 'Periféricos', slug: 'perifericos' },
                { id: '5', name: 'Componentes', slug: 'componentes' },
                { id: '6', name: 'Sillas Gamer', slug: 'sillas-gamer' },
            ]);
        }
    };

    // Filter products based on search and category
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategoryId ? (product.categoryId === selectedCategoryId || product.category === selectedCategoryId) : true;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategoryId]);


    // Search debounce (remains same but updates local state only, assuming all products loaded or search API supports category)
    // For now, let's stick to client-side filtering if product count is low, or server-side if high.
    // The previous implementation used server-side search. Let's keep it but also filter by category client-side for now
    // until backend supports category filter in search.
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (token) {
                if (searchTerm) {
                    ProductService.searchProducts(token, searchTerm)
                        .then((res) => {
                            const data = Array.isArray(res) ? res : res.data;
                            if (data && data.length > 0) setProducts(data);
                        })
                        .catch(err => console.error(err));
                } else {
                    loadProducts();
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, token]);


    const loadProducts = async () => {
        setIsLoading(true);

        // Mock data definition
        const mockProducts: Product[] = [
            {
                id: 'p1', name: 'PC Gamer RTX 4090', price: 3500000,
                sku: 'PC-HENDRIX-01', totalStock: 5, categoryId: '1', productType: 'PRODUCT', isPublished: true,
                images: ['https://m.media-amazon.com/images/I/71s+lH-Lw4L._AC_SX679_.jpg']
            },
            {
                id: 'p2', name: 'Monitor 27" 165Hz', price: 250000,
                sku: 'MON-LG-27', totalStock: 12, categoryId: '3', productType: 'PRODUCT', isPublished: true,
                images: ['https://m.media-amazon.com/images/I/71rXSVqETdL._AC_SX679_.jpg']
            },
            {
                id: 'p3', name: 'Teclado Mecánico RGB', price: 89990,
                sku: 'KB-RAZER-01', totalStock: 20, categoryId: '4', productType: 'PRODUCT', isPublished: true,
                images: ['https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SX679_.jpg']
            },
            {
                id: 'p4', name: 'Mouse Gamer Wireless', price: 65000,
                sku: 'MS-LOGI-GPRO', totalStock: 15, categoryId: '4', productType: 'PRODUCT', isPublished: true,
                images: ['https://m.media-amazon.com/images/I/61UxfWrhLnL._AC_SX679_.jpg']
            },
            {
                id: 'p5', name: 'Silla Gamer Ergonomica', price: 180000,
                sku: 'CHAIR-DXR-01', totalStock: 3, categoryId: '6', productType: 'PRODUCT', isPublished: true,
                images: ['https://m.media-amazon.com/images/I/61HEqHMkRhL._AC_SX679_.jpg']
            },
            {
                id: 'p6', name: 'Nvidia RTX 4070 Ti', price: 890000,
                sku: 'GPU-ASUS-4070', totalStock: 8, categoryId: '5', productType: 'PRODUCT', isPublished: true,
                images: ['https://m.media-amazon.com/images/I/7163-v-5bZL._AC_SX679_.jpg']
            },
        ];

        if (!token) {
            setProducts(mockProducts);
            setIsLoading(false);
            return;
        }

        try {
            // Fetch all products for now to allow client-side category filtering
            const res = await ProductService.getAllProducts(token!, 1, 100);
            const data = res.data;
            if (data && data.length > 0) {
                setProducts(data);
            } else {
                throw new Error("No products found");
            }
        } catch (error) {
            console.warn('Error loading products, using mock:', error);
            setProducts(mockProducts);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        toast.success(`${product.name} agregado`, { duration: 1000, position: 'bottom-center' });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.product.id === productId) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }, [cart]);

    const handleCheckout = async (method: PaymentMethod) => {
        // ... (checkout logic remains same)
        if (!token || !currentUser || cart.length === 0) return;

        let companyIdToUse = selectedCompanyId;

        if (!companyIdToUse) {
            try {
                const companies = await CompanyService.getAllCompanies();
                const list = Array.isArray(companies) ? companies : companies.data;
                const generic = list.find(c => c.name.toLowerCase().includes('general') || c.isClient);
                if (generic) {
                    companyIdToUse = generic.id;
                } else {
                    toast.error('No hay clientes registrados para asignar la venta.');
                    return;
                }
            } catch (e) {
                toast.error('Error buscando cliente por defecto');
                return;
            }
        }

        setIsCheckingOut(true);
        try {
            const vatRate = 19;
            const subTotal = cartTotal / 1.19;
            const vatAmount = cartTotal - subTotal;

            await SaleService.createSale({
                userId: currentUser.id,
                companyId: companyIdToUse,
                source: OrderSource.POS,
                status: OrderStatus.DELIVERED,
                paymentStatus: PaymentStatus.PAID,
                paymentMethod: method,
                currency: 'CLP',
                subTotalAmount: subTotal,
                vatAmount: vatAmount,
                vatRatePercent: vatRate,
                discountAmount: 0,
                shippingAmount: 0,
                grandTotalAmount: cartTotal,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: item.product.price,
                    totalPrice: item.product.price * item.quantity,
                    itemVatAmount: (item.product.price * item.quantity) - ((item.product.price * item.quantity) / 1.19),
                    totalPriceWithVat: item.product.price * item.quantity,
                }))
            });

            toast.success('¡Venta realizada con éxito!', { duration: 3000 });
            setCart([]);
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Error al procesar la venta');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="flex h-full max-h-screen overflow-hidden bg-[#020617] text-white selection:bg-blue-500/30">
            {/* Sidebar Categories */}
            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
            />

            {/* Middle Column: Product Grid */}
            <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden relative">
                {/* Background ambient glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Header / Search */}
                <div className="flex justify-between items-center bg-[#0b1120]/60 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-2xl border border-white/5 shrink-0 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                            <Typography variant="h5" color="white" className="font-black tracking-tighter">PV</Typography>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <Typography variant="h5" color="white" className="font-extrabold tracking-tight">
                                    Punto de Venta
                                </Typography>
                                <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                    <span className="text-[8px] font-black tracking-widest text-blue-400 uppercase">
                                        Premium
                                    </span>
                                </div>
                            </div>
                            <Typography variant="small" className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                {currentUser?.firstName || 'Cajero'} {currentUser?.lastName || 'Principal'}
                            </Typography>
                        </div>
                    </div>

                    <div className="flex-1 max-w-xl px-8">
                        <div className="relative group">
                            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="w-full bg-[#0f172a]/90 !bg-[#0f172a]/90 border border-white/10 focus:border-blue-500/50 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-base appearance-none shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Tooltip content="Pantalla Completa" placement="bottom" className="bg-slate-900 text-white border border-white/10">
                            <IconButton
                                variant="text"
                                color="white"
                                className="h-11 w-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                                onClick={() => {
                                    if (!document.fullscreenElement) {
                                        document.documentElement.requestFullscreen();
                                    } else {
                                        if (document.exitFullscreen) {
                                            document.exitFullscreen();
                                        }
                                    }
                                }}
                            >
                                <ArrowsPointingOutIcon className="h-5 w-5" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content="Cerrar Sesión" placement="bottom" className="bg-slate-900 text-white border border-white/10">
                            <IconButton
                                variant="text"
                                color="red"
                                className="h-11 w-11 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all"
                                onClick={() => router.push('/dashboard')}
                            >
                                <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-400" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 pr-2 pb-20 content-start relative z-10 scrollbar-hide">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center items-center h-64">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-blue-500/40 rounded-full blur-xl animate-pulse"></div>
                            </div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-32 flex flex-col items-center">
                            <div className="p-8 bg-slate-900/50 rounded-full mb-6 border border-white/5">
                                <TagIcon className="h-20 w-20 text-slate-700" />
                            </div>
                            <Typography variant="h4" className="font-bold text-slate-600">No se encontraron productos</Typography>
                            <Typography className="text-slate-500 mt-2">Intenta buscar con otros términos</Typography>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative"
                                onClick={() => addToCart(product)}
                            >
                                {/* Card Glow effect */}
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 rounded-[1.75rem] blur-xl transition-all duration-500"></div>

                                <Card
                                    className="bg-[#0b1120]/40 backdrop-blur-md border border-white/5 rounded-[1.75rem] cursor-pointer shadow-lg hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/30 transition-all duration-500 group-hover:-translate-y-1.5 overflow-hidden flex flex-col h-full"
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative h-44 w-full overflow-hidden">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                                <TagIcon className="h-10 w-10 text-slate-700" />
                                            </div>
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b1120] to-transparent"></div>

                                        {/* Stock Badge */}
                                        {product.productType === 'PRODUCT' && (
                                            <div className="absolute top-3 right-3 z-10">
                                                <div className={`px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest text-white shadow-xl backdrop-blur-md border border-white/10 ${(product.totalStock || 0) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {product.totalStock || '0'}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <CardBody className="p-4 pt-0 relative -mt-10 flex-1 flex flex-col justify-between z-10">
                                        <div>
                                            <Typography variant="h6" color="white" className="font-extrabold text-sm leading-tight mb-1.5 line-clamp-2 tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                                                {product.name}
                                            </Typography>
                                            <div className="flex items-center gap-1.5">
                                                <Typography variant="small" className="text-slate-500 font-bold tracking-widest uppercase text-[8px]">
                                                    {product.sku || 'REF-GEN'}
                                                </Typography>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex flex-col">
                                                <Typography variant="h4" className="text-blue-400 font-black text-lg tracking-tighter">
                                                    {formatCurrencyChilean(product.price)}
                                                </Typography>
                                            </div>
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-all duration-500 active:scale-90">
                                                <PlusIcon className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Column: Cart (Premium Order Ticket) */}
            <div className="w-[380px] bg-[#0b1120]/80 backdrop-blur-3xl flex flex-col shadow-[-30px_0_60px_rgba(0,0,0,0.6)] z-20 border-l border-white/5 relative overflow-hidden">
                {/* Visual Top Accent - Receipt style */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>

                {/* Header */}
                <div className="p-6 pb-4 shrink-0 relative">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <Typography variant="h5" color="white" className="font-black tracking-tight mb-0.5">Tu Orden</Typography>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                <Typography variant="small" className="text-slate-500 font-bold tracking-widest uppercase text-[9px]">En Proceso</Typography>
                            </div>
                        </div>
                        <IconButton
                            variant="text"
                            color="red"
                            className="h-10 w-10 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all group"
                            onClick={() => setCart([])}
                        >
                            <TrashIcon className="h-5 w-5 text-red-500/60 group-hover:text-red-500 transition-colors" />
                        </IconButton>
                    </div>

                    {/* Customer Selection */}
                    <div className="mb-6">
                        <Typography className="text-slate-500 font-black uppercase tracking-[0.2em] text-[8px] ml-1 mb-2">Asignar Cliente</Typography>
                        <div className="bg-slate-950/80 rounded-2xl p-0.5 border border-white/10 shadow-inner group focus-within:border-blue-500/30 transition-all">
                            <Select
                                label="Seleccionar"
                                className="text-white border-transparent bg-transparent focus:border-transparent text-sm font-bold h-11"
                                labelProps={{
                                    className: "hidden",
                                }}
                                menuProps={{
                                    className: "bg-[#0b1120] text-white border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.9)] p-2 rounded-xl backdrop-blur-2xl"
                                }}
                                value={selectedCompanyId}
                                onChange={(val) => setSelectedCompanyId(val || '')}
                                containerProps={{ className: "min-w-[100%]" }}
                            >
                                {clients.map((client) => (
                                    <Option key={client.id} value={client.id} className="hover:bg-blue-600/30 text-white py-3 my-0.5 rounded-lg transition-colors text-sm">
                                        <span className="font-bold">{client.name}</span>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2">
                            <ShoppingCartIcon className="h-4 w-4 text-blue-400" />
                            <Typography className="text-slate-300 font-black tracking-widest uppercase text-[9px]">Resumen de Venta</Typography>
                        </div>
                        <div className="bg-blue-600 h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                            <span className="text-[10px] font-black text-white">
                                {cart.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 pt-1 space-y-3 relative scrollbar-hide">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-700 select-none opacity-50 scale-90">
                            <ShoppingCartIcon className="h-20 w-20 mb-4 opacity-10" />
                            <Typography variant="small" className="font-black uppercase tracking-[0.2em] text-center text-[10px]">Carrito Vacío</Typography>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-[1.5rem] border border-white/5 shadow-md relative group transition-all hover:bg-white/10 hover:-translate-y-0.5">
                                {/* Image */}
                                <div className="h-14 w-14 rounded-xl bg-slate-900 flex-shrink-0 overflow-hidden border border-white/5 relative">
                                    {item.product.images?.[0] ? (
                                        <img src={item.product.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                    ) : <TagIcon className="p-4 text-slate-800" />}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <Typography color="white" className="font-black truncate text-sm leading-tight mb-0.5 tracking-tight group-hover:text-blue-400 transition-colors">
                                        {item.product.name}
                                    </Typography>
                                    <Typography className="text-blue-400 font-black text-xs">
                                        {formatCurrencyChilean(item.product.price)}
                                    </Typography>
                                </div>

                                {/* Touch Controls */}
                                <div className="flex items-center gap-1 bg-slate-950/80 rounded-xl p-1 border border-white/5">
                                    <div
                                        className={`h-7 w-7 flex items-center justify-center rounded-lg cursor-pointer transition-all active:scale-90 ${item.quantity <= 1
                                            ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20 shadow-lg shadow-red-500/10'
                                            : 'text-slate-500 bg-white/5 hover:bg-white/10 hover:text-white'
                                            }`}
                                        onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, -1) : removeFromCart(item.product.id)}
                                    >
                                        {item.quantity === 1 ? <TrashIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
                                    </div>
                                    <div className="w-6 text-center">
                                        <span className="text-xs font-black text-white">{item.quantity}</span>
                                    </div>
                                    <div
                                        className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-600 text-white cursor-pointer transition-all active:scale-90 hover:bg-blue-500 shadow-[0_4px_10px_rgba(37,99,235,0.4)]"
                                        onClick={() => updateQuantity(item.product.id, 1)}
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary & Totals */}
                <div className="bg-[#0b1120]/80 backdrop-blur-3xl p-6 pt-5 border-t border-white/5 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] z-20 shrink-0 relative overflow-hidden">
                    <div className="space-y-2 mb-6 relative z-10">
                        <div className="flex justify-between items-center">
                            <Typography className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Subtotal</Typography>
                            <Typography className="text-slate-300 font-bold text-sm">{formatCurrencyChilean(Math.round(cartTotal / 1.19))}</Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography className="text-slate-500 font-black uppercase tracking-widest text-[9px]">IVA (19%)</Typography>
                            <Typography className="text-slate-300 font-bold text-sm">{formatCurrencyChilean(cartTotal - Math.round(cartTotal / 1.19))}</Typography>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-2"></div>

                        <div className="flex justify-between items-center">
                            <div>
                                <Typography color="white" className="font-black tracking-tight leading-none mb-1 uppercase text-lg">Total</Typography>
                                <Typography className="text-green-500 font-bold text-[8px] tracking-widest uppercase flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                                    Facturación Lista
                                </Typography>
                            </div>
                            <Typography variant="h3" className="text-white font-black text-3xl tracking-tighter transition-all hover:text-blue-400">
                                {formatCurrencyChilean(cartTotal)}
                            </Typography>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 h-16 items-stretch relative z-10">
                        <Button
                            variant="text"
                            className="col-span-1 bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all normal-case p-0 flex flex-col items-center justify-center group"
                        >
                            <BanknotesIcon className="h-5 w-5 mb-0.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                            <span className="text-[8px] font-black tracking-widest">ESPERA</span>
                        </Button>
                        <IconButton
                            variant="text"
                            color="red"
                            className="col-span-1 bg-red-500/5 border border-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all h-full w-full"
                            onClick={() => setCart([])}
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </IconButton>
                        <Button
                            size="sm"
                            className="col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-500 flex flex-col items-center justify-center rounded-2xl border border-white/10 overflow-hidden"
                            onClick={() => handleCheckout(PaymentMethod.DEBIT_CARD)}
                            disabled={cart.length === 0 || isCheckingOut}
                        >
                            <div className="flex items-center gap-2">
                                <CreditCardIcon className="h-5 w-5 text-white" />
                                <span className="text-lg font-black tracking-tighter text-white uppercase">Pagar</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosView;
