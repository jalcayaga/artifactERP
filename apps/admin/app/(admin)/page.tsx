'use client';

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  ShoppingBag,
  RotateCcw
} from "lucide-react";

import {
  WelcomeCard,
  KPICard,
  ActivityFeed,
  SalesChart
} from "@/components/dashboard";

// Only defining types needed for this page
interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSalesAmount: number;
  pendingInvoices: number;
  acceptedQuotes: number;
  activeSubscriptions: number;
  mrr: number;
  recentActivities: any[];
}

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiClient.get('/dashboard');
        setData(res as DashboardData);
      } catch (e) {
        console.error("Error loading dashboard", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Use skeletons or just loading text (simplified for this iteration)
  if (loading || !data) {
    return <div className="p-8 text-[rgb(var(--text-secondary))]">Cargando dashboard...</div>;
  }

  // Simulated trend data
  const trends = {
    sales: { value: 23, direction: 'up' as const },
    refunds: { value: 12, direction: 'down' as const },
    earnings: { value: 8, direction: 'up' as const },
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Welcome & Top KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome Banner - Spans 6 columns on large screens */}
        <div className="lg:col-span-6">
          <WelcomeCard
            stats={{
              newLeads: data.totalUsers, // Mapping Users to Leads for demo
              conversion: 87
            }}
          />
        </div>

        {/* 3 KPI Cards - Each spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <KPICard
            title="Ventas"
            value={data.totalOrders}
            icon={<ShoppingBag className="w-6 h-6" />}
            iconColor="bg-pink-500"
            trend={trends.sales}
            className="h-full"
          />
        </div>

        <div className="lg:col-span-2">
          <KPICard
            title="Reembolsos"
            value="434" // Hardcoded for demo matching the design
            icon={<RotateCcw className="w-6 h-6" />}
            iconColor="bg-purple-500"
            trend={trends.refunds}
            className="h-full"
          />
        </div>

        <div className="lg:col-span-2">
          <KPICard
            title="Ganancias"
            value={formatCurrency(data.totalSalesAmount)}
            icon={<DollarSign className="w-6 h-6" />}
            iconColor="bg-teal-500"
            trend={trends.earnings}
            className="h-full"
          />
        </div>
      </div>

      {/* SECTION 2: Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Line Chart - Sales Profit */}
        <div className="lg:col-span-8 card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[rgb(var(--text-primary))]">Sales Profit</h3>
            <div className="flex bg-[rgb(var(--bg-secondary))] rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-medium bg-[rgb(var(--card-bg))] rounded shadow text-[rgb(var(--brand-color))]">Profit</button>
              <button className="px-3 py-1 text-xs font-medium text-[rgb(var(--text-secondary))]">Expenses</button>
            </div>
          </div>
          <SalesChart />
        </div>

        {/* Product Sales Donut (Placeholder for now, using ActivityFeed as the third column content or another card) */}
        <div className="lg:col-span-4 card-premium p-6 flex flex-col">
          <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-6">Actividad Reciente</h3>
          <ActivityFeed
            activities={data.recentActivities?.map(a => ({
              id: a.id,
              type: 'order',
              actor: { name: a.user?.firstName || 'User' },
              action: 'creó una orden',
              timestamp: new Date(a.createdAt),
              amount: 0 // activities from API might not have amount in this light mapper, ok for now
            })) || []}
            maxItems={5}
          />
        </div>
      </div>

      {/* SECTION 3: Bottom Row (Placeholder for tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium p-6 min-h-[200px]">
          <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-4">Marketing Report</h3>
          <div className="text-[rgb(var(--text-secondary))] text-sm">Contenido en desarrollo...</div>
        </div>
        <div className="card-premium p-6 min-h-[200px]">
          <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-4">Payments</h3>
          <div className="text-[rgb(var(--text-secondary))] text-sm">Contenido en desarrollo...</div>
        </div>
      </div>
    </div>
  );
}
