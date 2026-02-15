'use client';

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import {
  WelcomeKPICard,
  RevenueChart,
  FunnelChart,
  ProductsTable,
  TransactionsList
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

  const metrics = data || {
    totalSalesAmount: 0,
    totalProducts: 0,
    pendingInvoices: 0,
    acceptedQuotes: 0,
    recentActivities: []
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Top Cards (KPIs, Active Invoices/Quotes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[320px]">
        {/* Welcome / Main KPI Card */}
        <div className="h-full">
          <WelcomeKPICard
            totalSales={metrics.totalSalesAmount}
            totalProducts={metrics.totalProducts}
            loading={loading}
          />
        </div>

        {/* Sales Composition / Status */}
        <div className="h-full">
          <RevenueChart
            pendingInvoices={metrics.pendingInvoices}
            acceptedQuotes={metrics.acceptedQuotes}
            loading={loading}
          />
        </div>

        {/* Operations Funnel (Pending vs MRR/Goal) */}
        <div className="h-full">
          <FunnelChart
            pendingCount={metrics.pendingInvoices}
            acceptedCount={metrics.acceptedQuotes}
            loading={loading}
          />
        </div>
      </div>

      {/* SECTION 2: Bottom Section (Real Products & Recent Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Performing/Seeded Products - Spans 8 columns */}
        <div className="lg:col-span-8 h-full">
          <ProductsTable />
        </div>

        {/* Recent Activities from Backend - Spans 4 columns */}
        <div className="lg:col-span-4 h-full">
          <TransactionsList activities={metrics.recentActivities} loading={loading} />
        </div>
      </div>
    </div>
  );
}
