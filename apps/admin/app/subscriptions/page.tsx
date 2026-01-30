'use client';

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSubscriptions() {
            try {
                const res = await apiClient.get<any[]>('/subscriptions');
                setSubscriptions(res || []);
            } catch (e) {
                console.error("Error loading subscriptions:", e);
            } finally {
                setLoading(false);
            }
        }
        loadSubscriptions();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'PAST_DUE': return 'bg-red-100 text-red-700';
            case 'CANCELED': return 'bg-gray-100 text-gray-700';
            case 'PAUSED': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    if (loading) return <div className="p-8">Cargando suscripciones...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Suscripciones</h1>
                <button
                    onClick={async () => {
                        try {
                            await apiClient.post('/subscriptions/manual-renewal');
                            alert('Proceso de renovación manual disparado');
                        } catch (e) {
                            alert('Error al disparar renovación manual');
                        }
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors text-sm font-semibold"
                >
                    Ejecutar Renovación Manual
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Empresa</th>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                            <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Siguiente Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions && subscriptions.length > 0 ? (
                            subscriptions.map((sub: any) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-medium">{sub.company?.name || 'Cliente SaaS'}</p>
                                        <p className="text-xs text-gray-500">{sub.company?.rut}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{sub.product?.name || 'Plan Estándar'}</p>
                                        <p className="text-xs text-gray-500">{sub.interval}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-bold text-brand">
                                            ${new Intl.NumberFormat('es-CL').format(sub.price)}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Date(sub.nextBillingDate).toLocaleDateString()}</p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-5 py-5 bg-white text-center text-gray-500 italic">No hay suscripciones registradas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
