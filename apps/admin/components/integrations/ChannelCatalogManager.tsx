'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ChannelOffer,
    Product,
    OrderSource,
    formatCurrencyChilean,
    ChannelOfferService,
    ProductService,
    useAuth,
    Lot
} from '@artifact/core/client';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    IconButton,
    Chip,
    Select,
    Option,
    Tooltip,
    Switch,
    Spinner
} from "@material-tailwind/react";
import {
    Search,
    Plus,
    Trash2,
    ExternalLink,
    Settings,
    Package,
    ShoppingCart,
    AlertCircle,
    MoreVertical,
    Layers,
    Edit,
    DollarSign,
    Check,
    X
} from 'lucide-react';
import { toast } from 'sonner';

const CHANNELS = [
    { value: OrderSource.WHATSAPP, label: 'WhatsApp', color: 'green' },
    { value: OrderSource.MERCADO_LIBRE, label: 'Mercado Libre', color: 'yellow' },
    { value: OrderSource.PEDIDOS_YA, label: 'PedidosYa', color: 'red' },
    { value: OrderSource.UBER_EATS, label: 'Uber Eats', color: 'blue-gray' },
];

const ChannelCatalogManager: React.FC = () => {
    const { token } = useAuth();
    const [selectedChannel, setSelectedChannel] = useState<OrderSource>(OrderSource.WHATSAPP);
    const [offers, setOffers] = useState<ChannelOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showProductPicker, setShowProductPicker] = useState(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isPicking, setIsPicking] = useState(false);
    const [pickerSearch, setPickerSearch] = useState('');

    // Lot whitelisting states
    const [showLotManager, setShowLotManager] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<ChannelOffer | null>(null);
    const [productLots, setProductLots] = useState<Lot[]>([]);
    const [isLoadingLots, setIsLoadingLots] = useState(false);

    const fetchOffers = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await ChannelOfferService.getAllOffers(token, selectedChannel);
            setOffers(data);
        } catch (error) {
            console.error('Error fetching offers:', error);
            toast.error('Error al cargar catálogo del canal');
        } finally {
            setIsLoading(false);
        }
    }, [token, selectedChannel]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const fetchAllProducts = useCallback(async () => {
        if (!token) return;
        setIsPicking(true);
        try {
            const resp = await ProductService.getAllProducts(token, 1, 100);
            setAllProducts(resp.data);
        } catch (error) {
            toast.error('Error al cargar productos');
        } finally {
            setIsPicking(false);
        }
    }, [token]);

    useEffect(() => {
        if (showProductPicker) {
            fetchAllProducts();
        }
    }, [showProductPicker, fetchAllProducts]);

    const toggleOfferStatus = async (offer: ChannelOffer) => {
        if (!token) return;
        try {
            await ChannelOfferService.updateOffer(offer.id, { isActive: !offer.isActive }, token);
            setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, isActive: !o.isActive } : o));
            toast.success('Estado actualizado');
        } catch (error) {
            toast.error('Error al actualizar estado');
        }
    };

    const removeOffer = async (id: string) => {
        if (!token) return;
        if (!confirm('¿Estás seguro de eliminar este producto del catálogo del canal?')) return;
        try {
            await ChannelOfferService.deleteOffer(id, token);
            setOffers(prev => prev.filter(o => o.id !== id));
            toast.success('Producto removido del canal');
        } catch (error) {
            toast.error('Error al remover producto');
        }
    };

    const handleUpdatePrice = async (offer: ChannelOffer, newPrice: number) => {
        if (!token || isNaN(newPrice)) return;
        try {
            await ChannelOfferService.updateOffer(offer.id, { price: newPrice }, token);
            setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, price: newPrice } : o));
            toast.success('Precio actualizado');
        } catch (error) {
            toast.error('Error al actualizar precio');
        }
    };

    const addProductToChannel = async (product: Product) => {
        if (!token) return;
        if (offers.some(o => o.productId === product.id)) {
            toast.error('El producto ya está en este canal');
            return;
        }

        try {
            const newOffer = await ChannelOfferService.createOffer({
                channel: selectedChannel,
                productId: product.id,
                price: product.price,
                isActive: true
            }, token);

            setOffers(prev => [...prev, { ...newOffer, product }]);
            toast.success(`${product.name} agregado a ${selectedChannel}`);
            setShowProductPicker(false);
        } catch (error) {
            toast.error('Error al agregar producto');
        }
    };

    const handleManageLots = async (offer: ChannelOffer) => {
        if (!token) return;
        setSelectedOffer(offer);
        setShowLotManager(true);
        setIsLoadingLots(true);
        try {
            const lots = await ProductService.getProductLots(offer.productId, token);
            setProductLots(lots);
        } catch (error) {
            toast.error('Error al cargar lotes');
        } finally {
            setIsLoadingLots(false);
        }
    };

    const toggleLotExclusion = async (lotId: string) => {
        if (!token || !selectedOffer) return;
        let newAllowedLotIds;
        if (selectedOffer.allowedLotIds.includes(lotId)) {
            newAllowedLotIds = selectedOffer.allowedLotIds.filter(id => id !== lotId);
        } else {
            newAllowedLotIds = [...selectedOffer.allowedLotIds, lotId];
        }

        try {
            await ChannelOfferService.updateOffer(selectedOffer.id, { allowedLotIds: newAllowedLotIds }, token);
            setSelectedOffer({ ...selectedOffer, allowedLotIds: newAllowedLotIds });
            setOffers(prev => prev.map(o => o.id === selectedOffer.id ? { ...o, allowedLotIds: newAllowedLotIds } : o));
            toast.success('Lotes actualizados');
        } catch (error) {
            toast.error('Error al actualizar lotes');
        }
    };

    const filteredOffers = offers.filter(offer =>
        offer.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPickerProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(pickerSearch.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Typography variant="h4" color="white" className="font-bold flex items-center gap-2">
                        <Layers className="h-6 w-6 text-blue-400" />
                        Gestión de Catálogos Omnicanal
                    </Typography>
                    <Typography color="gray" className="font-normal">
                        Administra precios y existencias segregadas por canal de venta.
                    </Typography>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        label="Seleccionar Canal"
                        value={selectedChannel}
                        onChange={(val) => setSelectedChannel(val as OrderSource)}
                        className="text-white"
                        containerProps={{ className: "min-w-[200px]" }}
                        labelProps={{ className: "text-blue-gray-200" }}
                    >
                        {CHANNELS.map(ch => (
                            <Option key={ch.value} value={ch.value}>{ch.label}</Option>
                        ))}
                    </Select>
                    <Button
                        className="flex items-center gap-2 bg-blue-500"
                        onClick={() => setShowProductPicker(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Producto
                    </Button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border border-white/10 shadow-none">
                    <CardBody className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Package className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <Typography variant="small" className="text-blue-gray-300 uppercase font-bold tracking-wider">Productos</Typography>
                            <Typography variant="h5" color="white">{offers.length}</Typography>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-white/5 border border-white/10 shadow-none">
                    <CardBody className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <Typography variant="small" className="text-blue-gray-300 uppercase font-bold tracking-wider">Precios Diferenciales</Typography>
                            <Typography variant="h5" color="white">{offers.filter(o => Number(o.price) !== Number(o.product?.price)).length}</Typography>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-white/5 border border-white/10 shadow-none">
                    <CardBody className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Settings className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <Typography variant="small" className="text-blue-gray-300 uppercase font-bold tracking-wider">Configuraciones</Typography>
                            <Typography variant="h5" color="white">Activo</Typography>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Main Table */}
            <Card className="bg-[#1e293b] border border-white/5 overflow-hidden">
                <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent p-4 border-b border-white/5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative w-full md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-blue-gray-400" />
                            </div>
                            <Input
                                placeholder="Buscar en el catálogo..."
                                className="!border-white/10 text-white pl-10 focus:!border-blue-500 bg-white/5"
                                labelProps={{ className: "hidden" }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                crossOrigin={undefined}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Spinner className="h-8 w-8 text-blue-500" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            <Typography color="gray">Cargando catálogo del canal...</Typography>
                        </div>
                    ) : offers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <div className="p-6 bg-white/5 rounded-full mb-4">
                                <ShoppingCart className="h-12 w-12 text-blue-gray-600" />
                            </div>
                            <Typography variant="h6" color="white">No hay productos en este canal</Typography>
                            <Typography className="text-blue-gray-300 max-w-xs mb-6">Empieza agregando productos del inventario oficial a este canal de venta.</Typography>
                            <Button size="sm" color="blue" variant="outlined" onClick={() => setShowProductPicker(true)}>Agregar Primer Producto</Button>
                        </div>
                    ) : (
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {["Producto", "Base (ERP)", "Precio Canal", "Stock Canal", "Lotes", "Estado", "Acciones"].map((head) => (
                                        <th key={head} className="border-b border-white/5 bg-white/2 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-bold uppercase opacity-70">
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOffers.map((offer, index) => {
                                    const isLast = index === filteredOffers.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-white/5";

                                    return (
                                        <tr key={offer.id} className="hover:bg-white/2 transition-colors group">
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                                                        {offer.product?.images?.[0] ? (
                                                            <img src={offer.product.images[0]} alt={offer.product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-blue-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Typography variant="small" color="white" className="font-bold">
                                                            {offer.product?.name}
                                                        </Typography>
                                                        <Typography variant="small" className="text-[10px] text-blue-gray-400 tracking-wider font-mono">
                                                            SKU: {offer.product?.sku || 'N/A'}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" className="text-blue-gray-300">
                                                    {formatCurrencyChilean(offer.product?.price || 0)}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                    <Typography variant="small" color="white" className="font-bold">
                                                        {formatCurrencyChilean(offer.price)}
                                                    </Typography>
                                                    <IconButton
                                                        size="sm"
                                                        variant="text"
                                                        color="blue-gray"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            const newP = prompt('Ingrese nuevo precio para este canal:', offer.price.toString());
                                                            if (newP) handleUpdatePrice(offer, parseFloat(newP));
                                                        }}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-2">
                                                    <Chip
                                                        variant="gradient"
                                                        size="sm"
                                                        value={offer.product?.totalStock || 0}
                                                        color={(offer.product?.totalStock || 0) > 0 ? "green" : "red"}
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip content={offer.allowedLotIds.length > 0 ? `Restringido a ${offer.allowedLotIds.length} lotes` : "Todos los lotes disponibles"}>
                                                        <IconButton
                                                            variant="text"
                                                            color={offer.allowedLotIds.length > 0 ? "purple" : "blue-gray"}
                                                            onClick={() => handleManageLots(offer)}
                                                        >
                                                            <Layers className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Switch
                                                    id={`switch-${offer.id}`}
                                                    checked={offer.isActive}
                                                    onChange={() => toggleOfferStatus(offer)}
                                                    color="blue"
                                                    crossOrigin={undefined}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-1">
                                                    <IconButton variant="text" color="red" onClick={() => removeOffer(offer.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </CardBody>
            </Card>

            {/* Product Picker Modal */}
            {showProductPicker && (
                <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="bg-[#1e293b] border border-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <CardHeader floated={false} shadow={false} className="bg-transparent m-0 p-6 flex items-center justify-between border-b border-white/5">
                            <div>
                                <Typography variant="h5" color="white">Agregar Producto a {selectedChannel}</Typography>
                                <Typography variant="small" color="gray">Selecciona un producto del inventario general.</Typography>
                            </div>
                            <IconButton variant="text" color="white" onClick={() => setShowProductPicker(false)}>
                                <X className="h-6 w-6" />
                            </IconButton>
                        </CardHeader>
                        <CardBody className="flex-1 overflow-y-auto p-0 px-6 py-4">
                            <div className="mb-4 sticky top-0 bg-[#1e293b] z-10 py-2">
                                <Input
                                    label="Buscar producto..."
                                    color="white"
                                    value={pickerSearch}
                                    onChange={(e) => setPickerSearch(e.target.value)}
                                    className="!border-white/10"
                                    crossOrigin={undefined}
                                />
                            </div>
                            {isPicking ? (
                                <div className="flex justify-center p-12">
                                    <Spinner className="h-8 w-8" color="blue" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredPickerProducts.map(product => {
                                        const isAdded = offers.some(o => o.productId === product.id);
                                        return (
                                            <div key={product.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isAdded ? 'bg-white/2 border-white/5 opacity-40' : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'}`} onClick={() => !isAdded && addProductToChannel(product)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                        <Package className="h-5 w-5 text-blue-gray-400" />
                                                    </div>
                                                    <div>
                                                        <Typography variant="small" color="white" className="font-bold">{product.name}</Typography>
                                                        <Typography variant="small" className="text-[10px] text-blue-gray-400 font-mono">SKU: {product.sku || 'N/A'}</Typography>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Typography variant="small" className="font-bold text-blue-400">{formatCurrencyChilean(product.price)}</Typography>
                                                    {!isAdded && <Button size="sm" variant="text" color="blue" className="px-2">Agregar</Button>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Lot Manager Modal */}
            {showLotManager && selectedOffer && (
                <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="bg-[#1e293b] border border-white/10 w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl">
                        <CardHeader floated={false} shadow={false} className="bg-transparent m-0 p-6 flex items-center justify-between border-b border-white/5">
                            <div>
                                <Typography variant="h5" color="white">Whitelisting de Lotes</Typography>
                                <Typography variant="small" color="gray">Solo los lotes seleccionados estarán disponibles para este canal.</Typography>
                            </div>
                            <IconButton variant="text" color="white" onClick={() => setShowLotManager(false)}>
                                <X className="h-6 w-6" />
                            </IconButton>
                        </CardHeader>
                        <CardBody className="flex-1 overflow-y-auto p-6">
                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 mb-6 flex gap-3 items-start">
                                <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                                <Typography variant="small" className="text-blue-100">
                                    Si no se selecciona ningún lote, se utilizarán todos los lotes disponibles según el FIFO del sistema principal.
                                </Typography>
                            </div>

                            {isLoadingLots ? (
                                <div className="flex justify-center p-12">
                                    <Spinner className="h-8 w-8" color="blue" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {productLots.map(lot => {
                                        const isAllowed = selectedOffer.allowedLotIds.length === 0 || selectedOffer.allowedLotIds.includes(lot.id);
                                        return (
                                            <div
                                                key={lot.id}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isAllowed ? 'bg-blue-500/5 border-blue-500/20 shadow-lg shadow-blue-500/5' : 'bg-white/5 border-white/10 opacity-60'}`}
                                                onClick={() => toggleLotExclusion(lot.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${isAllowed ? 'bg-blue-500 text-white' : 'bg-white/5 text-blue-gray-400'}`}>
                                                        {isAllowed ? <Check className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <Typography variant="small" color="white" className="font-bold">Lote: {lot.lotNumber}</Typography>
                                                        <Typography variant="small" className="text-[10px] text-blue-gray-400">Exp: {lot.expirationDate ? new Date(lot.expirationDate).toLocaleDateString() : 'N/A'}</Typography>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Typography variant="small" color="white" className="font-bold">{lot.currentQuantity} unid.</Typography>
                                                    <Typography variant="small" className="text-[10px] text-blue-gray-400">{lot.location || 'Sin ubicación'}</Typography>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {productLots.length === 0 && (
                                        <div className="text-center p-8 text-blue-gray-400 italic">Este producto no tiene lotes registrados.</div>
                                    )}
                                </div>
                            )}
                        </CardBody>
                        <div className="p-6 border-t border-white/5">
                            <Button fullWidth color="blue" onClick={() => setShowLotManager(false)}>Finalizar Configuración</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ChannelCatalogManager;
