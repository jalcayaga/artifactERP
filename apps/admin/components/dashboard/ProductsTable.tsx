'use client';

import React from 'react';
import { Typography } from '@material-tailwind/react';
import { apiClient } from '@/lib/api';

const TABLE_HEAD = ["Producto", "Tipo", "Precio", "SKU"];

const ProductsTable: React.FC = () => {
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadProducts() {
            try {
                const res = await apiClient.get('/products?limit=5');
                setProducts(res.data || []);
            } catch (e) {
                console.error("Error loading products for dashboard", e);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    return (
        <div className="card-premium p-6 h-full w-full">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h5" color="white" className="font-bold tracking-tight text-xl">
                    Catálogo de Productos - Informatica Test
                </Typography>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-b border-white/5 py-4 px-2">
                                    <Typography
                                        className="text-[11px] font-bold text-[#7b8893] uppercase tracking-[0.15em] leading-none"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center sm:text-left">
                                    <Typography variant="small" className="text-[#7b8893] animate-pulse">Cargando productos...</Typography>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center sm:text-left">
                                    <Typography variant="small" className="text-[#7b8893]">No hay productos cargados.</Typography>
                                </td>
                            </tr>
                        ) : products.map((product) => (
                            <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#00a1ff]/10 flex items-center justify-center text-[#00a1ff] font-bold text-sm border border-[#00a1ff]/10">
                                            {product.name[0]}
                                        </div>
                                        <div>
                                            <Typography
                                                className="font-semibold text-white text-[15px]"
                                            >
                                                {product.name}
                                            </Typography>
                                            <Typography className="text-[12px] text-[#7b8893]">
                                                {product.id.slice(0, 8)}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-2">
                                    <div className="w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#00a1ff] bg-[#00a1ff]/10 border border-[#00a1ff]/20">
                                        {product.productType}
                                    </div>
                                </td>
                                <td className="py-4 px-2">
                                    <Typography className="text-white font-semibold text-[15px]">
                                        ${product.price?.toLocaleString()}
                                    </Typography>
                                </td>
                                <td className="py-4 px-2">
                                    <Typography className="text-[#7b8893] font-medium text-[13px]">
                                        {product.sku}
                                    </Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsTable;
