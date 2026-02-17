'use client';

import React, { useState, useEffect } from 'react';
import {
    Popover,
    PopoverHandler,
    PopoverContent,
    Typography,
    IconButton,
    Card,
    Chip,
    Spinner
} from "@material-tailwind/react";
import { Info, TrendingUp, Package, Building2, Calculator } from 'lucide-react';
import { ProductIntelligence, formatCurrencyChilean } from '@artifact/core';
import { ProductService } from '@artifact/core/client';
import { useAuth } from '@artifact/core';

interface ProductIntelligencePopoverProps {
    productId: string;
    projectName?: string;
}

const ProductIntelligencePopover: React.FC<ProductIntelligencePopoverProps> = ({ productId }) => {
    const { token } = useAuth();
    const [intelligence, setIntelligence] = useState<ProductIntelligence | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchIntelligence = async () => {
        if (!productId || !token) return;
        setLoading(true);
        try {
            const data = await ProductService.getProductIntelligence(productId, token);
            setIntelligence(data);
        } catch (error) {
            console.error('Error fetching product intelligence:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popover placement="bottom-start">
            <PopoverHandler>
                <IconButton
                    variant="text"
                    color="blue"
                    size="sm"
                    className="rounded-full bg-blue-500/10 hover:bg-blue-500/20"
                    onMouseEnter={fetchIntelligence}
                    placeholder=""
                >
                    <Info className="w-4 h-4" />
                </IconButton>
            </PopoverHandler>
            <PopoverContent className="z-[9999] w-[450px] bg-[#1a2537] border-white/10 shadow-2xl p-0 overflow-hidden" placeholder="">
                <div className="p-4 border-b border-white/5 bg-blue-500/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Calculator className="w-4 h-4 text-blue-400" />
                        <Typography color="white" className="font-black uppercase italic text-xs tracking-tight" placeholder="">
                            Inteligencia de <span className="text-blue-400">Producto</span>
                        </Typography>
                    </div>
                    <Typography className="text-[10px] text-slate-400 uppercase font-bold tracking-widest" placeholder="">
                        Análisis de costos y rentabilidad en tiempo real
                    </Typography>
                </div>

                <div className="p-4 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <Spinner className="h-8 w-8 text-blue-500" />
                            <Typography className="text-[10px] text-slate-500 font-black uppercase tracking-widest" placeholder="">
                                Calculando PPC...
                            </Typography>
                        </div>
                    ) : intelligence ? (
                        <>
                            {/* Financial Metrics */}
                            <div className="grid grid-cols-2 gap-3">
                                <Card className="bg-white/5 border border-white/5 p-3 rounded-xl" shadow={false} placeholder="">
                                    <Typography className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1" placeholder="">
                                        Costo Promedio (PPC)
                                    </Typography>
                                    <Typography color="white" className="text-lg font-black italic" placeholder="">
                                        {formatCurrencyChilean(intelligence.averagePurchasePrice)}
                                    </Typography>
                                </Card>
                                <Card className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl" shadow={false} placeholder="">
                                    <Typography className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1" placeholder="">
                                        Venta Sugerida (30%)
                                    </Typography>
                                    <Typography color="white" className="text-lg font-black italic text-blue-400" placeholder="">
                                        {formatCurrencyChilean(intelligence.suggestedPrice)}
                                    </Typography>
                                </Card>
                            </div>

                            {/* Lots List */}
                            <div className="space-y-2">
                                <Typography className="text-[9px] text-slate-500 font-black uppercase tracking-widest px-1" placeholder="">
                                    Desglose por Lotes / Sucursales
                                </Typography>
                                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {intelligence.lots.map((lot) => (
                                        <div key={lot.id} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                    <Package className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <div>
                                                    <Typography color="white" className="text-[11px] font-black uppercase italic" placeholder="">
                                                        Lote: {lot.lotNumber}
                                                    </Typography>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Building2 className="w-3 h-3 text-slate-500" />
                                                        <Typography className="text-[9px] text-slate-500 font-bold uppercase" placeholder="">
                                                            {lot.warehouseName}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Typography color="white" className="text-xs font-black" placeholder="">
                                                    {lot.currentQuantity} Unid.
                                                </Typography>
                                                <Typography className="text-[10px] text-blue-400 font-bold" placeholder="">
                                                    {formatCurrencyChilean(lot.purchasePrice)}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Insight */}
                            <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-start gap-3">
                                <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <Typography className="text-[10px] text-slate-400 leading-relaxed" placeholder="">
                                    El precio de venta sugerido asegura un <span className="text-blue-400 font-bold">margen bruto del 30%</span> basado en tu costo promedio ponderado de inventario.
                                </Typography>
                            </div>
                        </>
                    ) : (
                        <div className="py-8 text-center text-slate-500 uppercase text-[10px] font-black tracking-widest">
                            No hay datos de inteligencia disponibles
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ProductIntelligencePopover;
