'use client';

import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/Stats";
import { apiClient } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiClient.get('/dashboard');
        setData(res);
      } catch (e) {
        console.error("Error loading dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8">Cargando dashboard...</div>;
  if (!data) return <div className="p-8">Error al cargar datos de Dashboard.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Resumen del Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Facturación Total"
          value={`$${new Intl.NumberFormat('es-CL').format(data.totalSalesAmount)}`}
          description="Ventas acumuladas (Pagadas/Entregadas)"
        />
        <StatsCard
          title="MRR"
          value={`$${new Intl.NumberFormat('es-CL').format(Math.round(data.mrr || 0))}`}
          description="Ingreso Mensual Recurrente"
        />
        <StatsCard
          title="Suscripciones Activas"
          value={data.activeSubscriptions || 0}
          description="Contratos con plan vigente"
        />
        <StatsCard
          title="Usuarios Totales"
          value={data.totalUsers}
          description="Usuarios en plataforma"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Actividad Reciente (Órdenes)</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Empresa</th>
                <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.recentActivities && data.recentActivities.length > 0 ? (
                data.recentActivities.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap font-medium">{order.company?.name || 'Venta Web'}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap font-bold text-brand">
                        ${new Intl.NumberFormat('es-CL').format(order.grandTotalAmount)}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-100 bg-white text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-5 bg-white text-center text-gray-500 italic">No hay actividad reciente</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
