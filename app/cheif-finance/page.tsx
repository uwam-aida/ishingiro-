'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Trash2,
  PackageX,
  Activity,
  Boxes,
  Loader2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type Branch = 'All' | 'Kabuga' | 'Masaka';
type View = 'Overview' | 'Performance' | 'Losses';

/** One row from GET /finance/ledger — this endpoint is a DAMAGE AUDIT LOG only.
 *  It has never contained sales data, so it must not be treated as one. */
interface DamageEntry {
  id: number;
  product: string;
  price: number;
  cost: number;
  quantity: number;
  reason: string;
  location: string;
  reported_by: string;
  date: string;
  created_at: string;
}

/** One bar from GET /finance/chart — daily revenue total. */
interface ChartPoint {
  day: string;
  date: string; // raw "YYYY-MM-DD", needed to query the close-day report
  height: number;
  amount: number;
}

/** One product line from GET /finance/reports/close-day */
interface CloseDayProduct {
  product_name: string;
  product_id: number;
  delivered_qty: number;
  remaining_qty: number;
  damaged_qty: number;
  expired_qty: number;
  distributed_qty: number;
  unit_price: number;
  sold_qty: number;
  revenue: number;
}

/** GET /finance/reports/close-day?date=...&branch=... — the real, auditable
 *  breakdown: revenue = delivered − remaining − damaged − expired − distributed,
 *  computed per product then summed. This is the source of truth for
 *  "received products − damages − close day" rather than the lump Revenue table. */
interface CloseDayBreakdown {
  receivedValue: number;
  damagedValue: number;
  closeDayValue: number; // remaining + expired
  distributedValue: number;
  revenue: number;
  products: CloseDayProduct[];
}

/** One row from GET /finance/analytics/performance — the only endpoint that
 *  has real, per-product "units sold" data (sourced from shop orders). */
interface PerformanceItem {
  id: number;
  name: string;
  totalSold: number;
  stock: number;
  damaged: number;
  popularity: number;
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  recommendation: string;
}

/** GET /finance — grand totals, all branches, all time. */
interface FinanceSummary {
  revenue: number;
  orders: number;
}

/** GET /finance/analytics/summary — headline KPIs with trend labels. */
interface AnalyticsSummary {
  sales: { value: number; trend: string };
  production: { value: number; trend: string };
  inventory: { value: number; trend: string };
  damage: { value: number; trend: string };
}

/** One entry from GET /finance/analytics/activities */
interface ActivityEntry {
  id: number;
  user: string;
  role: string;
  category: 'production' | 'damage';
  action: string;
  item: string;
  quantity: number;
  time: string;
}

/** One row from GET /finance/inventory/measured */
interface MeasuredIngredient {
  id: number;
  name: string;
  stock: string;
  status: 'Healthy' | 'Low';
  branch: string;
  value: number;
}

/** One row from GET /finance/inventory/baked */
interface BakedInventoryItem {
  id: number;
  name: string;
  daily: string;
  sold: string;
  loss: string;
  branch: string;
}

const todayISO = () => new Date().toISOString().split('T')[0];

const FALLBACK_CHART: ChartPoint[] = [
  { day: 'Mon', date: todayISO(), height: 45, amount: 450000 },
  { day: 'Tue', date: todayISO(), height: 30, amount: 300000 },
  { day: 'Wed', date: todayISO(), height: 60, amount: 600000 },
  { day: 'Thu', date: todayISO(), height: 50, amount: 500000 },
  { day: 'Fri', date: todayISO(), height: 85, amount: 850000 },
  { day: 'Sat', date: todayISO(), height: 70, amount: 700000 },
  { day: 'Sun', date: todayISO(), height: 95, amount: 950000 },
];

const formatMoney = (amount: number) => `${Math.round(amount).toLocaleString()} Frw`;

export default function Page() {
    const router = useRouter();

  // --- UI STATE ---
  const [selectedBranch, setSelectedBranch] = useState<Branch>('All');
  const [activeView, setActiveView] = useState<View>('Overview');
  const [activeDay, setActiveDay] = useState<ChartPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- LIVE DATA STATE ---
  const [damageLedger, setDamageLedger] = useState<DamageEntry[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>(FALLBACK_CHART);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceItem[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [measuredInventory, setMeasuredInventory] = useState<MeasuredIngredient[]>([]);
  const [bakedInventory, setBakedInventory] = useState<BakedInventoryItem[]>([]);

  // Real "received − damages − close day" breakdown for whichever day is in
  // focus (defaults to today). Sourced from /finance/reports/close-day.
  const [dayReport, setDayReport] = useState<CloseDayBreakdown | null>(null);
  const [isDayReportLoading, setIsDayReportLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  const authHeaders = useCallback((): HeadersInit => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  }, []);

  // ---------------------------------------------------------------------
  // Revenue chart — refetched whenever the branch filter changes, since
  // Revenue rows are tagged with `location` on the backend.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchChart = async () => {
      try {
        const locationParam = selectedBranch === 'All' ? '' : `?location=${selectedBranch.toLowerCase()}`;
        const res = await fetch(`${baseUrl}/finance/chart${locationParam}`, { headers: authHeaders() });
        if (!res.ok) return;

        const rows: { day: string; total: number }[] = await res.json();
        if (!rows.length) {
          setChartData([]);
          return;
        }

        const maxTotal = Math.max(...rows.map((r) => r.total));
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        setChartData(
          rows.map((r) => {
            const dateObj = new Date(r.day);
            const label = isNaN(dateObj.getTime()) ? r.day : dayNames[dateObj.getDay()];
            return {
              day: label,
              date: r.day,
              height: maxTotal > 0 ? (r.total / maxTotal) * 100 : 0,
              amount: r.total,
            };
          })
        );
      } catch (err) {
        console.error('Failed to load revenue chart', err);
      }
    };

    fetchChart();
  }, [selectedBranch, baseUrl, authHeaders]);

  // ---------------------------------------------------------------------
  // Close-day breakdown: "received products − damages − close day" for
  // whichever date is selected (today, by default). The endpoint only
  // accepts one branch at a time, so when "All" is selected we fetch both
  // and add the totals together.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const targetDate = activeDay?.date || todayISO();
    const branchesToFetch: ('kabuga' | 'masaka')[] =
      selectedBranch === 'All' ? ['kabuga', 'masaka'] : [selectedBranch.toLowerCase() as 'kabuga' | 'masaka'];

    const loadDayReport = async () => {
      setIsDayReportLoading(true);
      try {
        const responses = await Promise.all(
          branchesToFetch.map((branch) =>
            fetch(`${baseUrl}/finance/reports/close-day?date=${targetDate}&branch=${branch}`, {
              headers: authHeaders(),
            })
          )
        );

        const allProducts: CloseDayProduct[] = [];
        for (const res of responses) {
          if (!res.ok) continue;
          const json: { grand_total: number; products: CloseDayProduct[] } = await res.json();
          allProducts.push(...(json.products || []));
        }

        const receivedValue = allProducts.reduce((acc, p) => acc + p.delivered_qty * p.unit_price, 0);
        const damagedValue = allProducts.reduce((acc, p) => acc + p.damaged_qty * p.unit_price, 0);
        const closeDayValue = allProducts.reduce((acc, p) => acc + (p.remaining_qty + p.expired_qty) * p.unit_price, 0);
        const distributedValue = allProducts.reduce((acc, p) => acc + p.distributed_qty * p.unit_price, 0);
        const revenue = allProducts.reduce((acc, p) => acc + p.revenue, 0);

        setDayReport({ receivedValue, damagedValue, closeDayValue, distributedValue, revenue, products: allProducts });
      } catch (err) {
        console.error('Failed to load close-day report', err);
        setDayReport(null);
      } finally {
        setIsDayReportLoading(false);
      }
    };

    loadDayReport();
  }, [activeDay, selectedBranch, baseUrl, authHeaders]);

  // ---------------------------------------------------------------------
  // Everything else — fetched once on load, not branch-dependent at the
  // API level (filtering for these happens client-side, see below).
  // ---------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAll = async () => {
      try {
        const [
          ledgerRes,
          summaryRes,
          analyticsRes,
          performanceRes,
          activitiesRes,
          measuredInvRes,
          bakedInvRes,
        ] = await Promise.all([
          fetch(`${baseUrl}/finance/ledger`, { headers: authHeaders() }),
          fetch(`${baseUrl}/finance`, { headers: authHeaders() }),
          fetch(`${baseUrl}/finance/analytics/summary`, { headers: authHeaders() }),
          fetch(`${baseUrl}/finance/analytics/performance`, { headers: authHeaders() }),
          fetch(`${baseUrl}/finance/analytics/activities`, { headers: authHeaders() }),
          fetch(`${baseUrl}/finance/inventory/measured`, { headers: authHeaders() }),
          fetch(`${baseUrl}/finance/inventory/baked`, { headers: authHeaders() }),
        ]);

        if (ledgerRes.ok) setDamageLedger(await ledgerRes.json());
        if (summaryRes.ok) setFinanceSummary(await summaryRes.json());
        if (analyticsRes.ok) setAnalyticsSummary(await analyticsRes.json());
        if (performanceRes.ok) setPerformance(await performanceRes.json());
        if (activitiesRes.ok) setActivities(await activitiesRes.json());
        if (measuredInvRes.ok) setMeasuredInventory(await measuredInvRes.json());
        if (bakedInvRes.ok) setBakedInventory(await bakedInvRes.json());
      } catch (err) {
        console.error('Failed to load finance dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [router, baseUrl, authHeaders]);

  // ---------------------------------------------------------------------
  // DERIVED VALUES
  // ---------------------------------------------------------------------

  // The single day every stat card on this dashboard describes — today, or
  // whichever day was clicked on the chart.
  const activeDate = activeDay?.date || todayISO();

  // Damage log filtered to the selected branch AND the active day, so the
  // Financial Loss card describes the same period as Total Revenue rather
  // than mixing an all-time figure against a single day's figure.
  const filteredDamage = useMemo(() => {
    return damageLedger.filter((d) => {
      const branchMatch = selectedBranch === 'All' || d.location?.toLowerCase().includes(selectedBranch.toLowerCase());
      const dateMatch = d.date === activeDate;
      return branchMatch && dateMatch;
    });
  }, [damageLedger, selectedBranch, activeDate]);

  // Total financial loss = quantity damaged × production cost. This is the
  // only piece of "loss" that is actually backed by real per-item data.
  const totalLoss = useMemo(
    () => filteredDamage.reduce((acc, d) => acc + d.quantity * (d.cost || 0), 0),
    [filteredDamage]
  );

  // Total revenue = received products − damages − close day (remaining +
  // expired) − distributed, summed per product then by price. Sourced from
  // /finance/reports/close-day, the only endpoint that actually computes
  // this from real delivery/damage/closing records rather than a lump sum.
  const totalRevenue = dayReport?.revenue ?? 0;

  // "Revenue after losses" — deliberately NOT called Net Profit. totalRevenue
  // already excludes damaged/remaining/distributed units entirely (they were
  // never "sold"); totalLoss here is the separate production COST sunk into
  // the damaged units specifically — a real additional loss, not the same
  // thing counted twice.
  const revenueAfterLosses = totalRevenue - totalLoss;

  const pageInfo = useMemo(() => {
    const descriptions: Record<View, string> = {
      Overview: 'Revenue trend, headline KPIs, and recent activity.',
      Performance: 'Units sold, remaining stock, and damage per product (all-time).',
      Losses: 'Damage audit log — non-recoverable production losses.',
    };
    return descriptions[activeView];
  }, [activeView]);

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------

  return (
    <div className="space-y-8 pb-10 min-h-screen bg-[#FDFDFD]">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {(activeView !== 'Overview' || activeDay) && (
            <button
              onClick={() => {
                setActiveView('Overview');
                setActiveDay(null);
              }}
              className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 shadow-sm transition-all text-[#5D4037]"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-[#5D4037] tracking-tight uppercase">
              {activeView === 'Losses'
                ? 'Damage & Loss Report'
                : activeView === 'Performance'
                ? 'Product Performance'
                : activeDay
                ? `${activeDay.day} Revenue`
                : 'Financial Hub'}
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              {selectedBranch} Branch Analysis {isLoading && '· Loading live data...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center shadow-sm">
            {(['All', 'Kabuga', 'Masaka'] as const).map((branch) => (
              <button
                key={branch}
                onClick={() => {
                  setSelectedBranch(branch);
                  setActiveDay(null);
                }}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedBranch === branch ? 'bg-[#5D4037] text-white shadow-md' : 'text-gray-400 hover:text-[#5D4037]'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
        <button
          onClick={() => {
            setActiveView('Overview');
            setActiveDay(null);
          }}
          className={`p-6 rounded-[32px] border transition-all text-left group ${
            activeView === 'Overview' && !activeDay
              ? 'bg-white border-[#5D4037] shadow-lg ring-4 ring-[#5D4037]/5'
              : 'bg-white border-gray-100 shadow-sm hover:border-[#5D4037]'
          }`}
        >
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
            {activeDay ? `${activeDay.day} Revenue` : "Today's Revenue"}
          </p>
          <h2 className="text-3xl font-black text-[#5D4037] mt-1">
            {isDayReportLoading ? <Loader2 className="animate-spin" size={28} /> : formatMoney(totalRevenue)}
          </h2>
          <p className="text-[10px] font-bold text-gray-400 mt-1">Received − Damages − Close Day</p>
          {financeSummary && (
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={12} /> All-time: {formatMoney(financeSummary.revenue)} · {financeSummary.orders} orders
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveView('Losses')}
          className={`p-6 rounded-[32px] border transition-all text-left group relative overflow-hidden ${
            activeView === 'Losses'
              ? 'bg-white border-red-500 shadow-lg ring-4 ring-red-500/5'
              : 'bg-white border-gray-100 shadow-sm hover:border-red-200'
          }`}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle size={100} className="text-red-600" />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Financial Loss</p>
          <h2 className="text-3xl font-black text-red-500 mt-1">{formatMoney(totalLoss)}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 w-fit px-2 py-1 rounded-lg">
            <PackageX size={12} /> Click for details
          </div>
        </button>

        <div className="bg-[#5D4037] p-6 rounded-[32px] shadow-xl text-white relative overflow-hidden">
          <p className="text-[#EBE0CC] text-[10px] font-black uppercase tracking-widest">Revenue After Losses</p>
          <h2 className="text-3xl font-black mt-1">{formatMoney(revenueAfterLosses)}</h2>
          <p className="text-[10px] font-medium text-[#EBE0CC]/60 mt-4 italic">
            Revenue minus damaged/expired goods. Excludes production cost of items sold.
          </p>
        </div>
      </div>

      {/* --- OVERVIEW --- */}
      {activeView === 'Overview' && !activeDay && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-96 flex flex-col">
            <h3 className="text-lg font-black text-[#5D4037] uppercase tracking-tighter">Revenue Growth</h3>
            {chartData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-300 font-bold uppercase text-xs tracking-widest">
                No revenue recorded yet for {selectedBranch}
              </div>
            ) : (
              <div className="flex-1 flex items-end justify-between gap-2 md:gap-6 mt-6 pb-2">
                {chartData.map((point, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveDay(point)}
                    className="w-full flex flex-col items-center group cursor-pointer h-full justify-end"
                  >
                    <div
                      style={{ height: `${point.height}%` }}
                      className="w-full max-w-[50px] rounded-t-2xl transition-all duration-300 bg-[#EBE0CC] group-hover:bg-[#5D4037]"
                    />
                    <span className="text-[10px] font-black mt-3 text-gray-400 group-hover:text-[#5D4037]">{point.day}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KPI strip + recent activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              {analyticsSummary && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-[#5D4037] uppercase tracking-widest">Headline KPIs</h4>
                  {[
                    { label: 'All-time Sales (Frw)', stat: analyticsSummary.sales },
                    { label: 'Production (units)', stat: analyticsSummary.production },
                    { label: 'Inventory (units)', stat: analyticsSummary.inventory },
                    { label: 'Damage (units)', stat: analyticsSummary.damage },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{row.label}</span>
                      <span className="text-sm font-black text-gray-800">
                        {row.stat.value.toLocaleString()}{' '}
                        <span className="text-[9px] text-gray-400">{row.stat.trend}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {measuredInventory.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-black text-[#5D4037] uppercase tracking-widest flex items-center gap-2 mb-3">
                    <Boxes size={14} /> Raw Ingredients
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {measuredInventory.map((ing) => (
                      <div key={ing.id} className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-600 uppercase">{ing.name}</span>
                        <span className={ing.status === 'Low' ? 'text-red-500' : 'text-green-600'}>{ing.stock}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black text-[#5D4037] uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity size={14} /> Recent Activity
              </h4>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {activities.length === 0 && (
                  <p className="text-xs text-gray-300 font-bold uppercase text-center py-10">No recent activity</p>
                )}
                {activities.map((a) => (
                  <div key={`${a.category}-${a.id}`} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
                    <div>
                      <p className="font-bold text-gray-700">
                        {a.user} <span className="text-gray-400 font-medium">· {a.action}</span>
                      </p>
                      <p className="text-gray-400">
                        {a.item} × {a.quantity}
                      </p>
                    </div>
                    <span className="text-gray-300 font-bold whitespace-nowrap">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- REVENUE BREAKDOWN: received − damages − close day --- */}
      {activeView === 'Overview' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 animate-in slide-in-from-right-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-[#5D4037] uppercase tracking-tighter">
              {activeDay ? `${activeDay.day} Revenue Breakdown` : "Today's Revenue Breakdown"}
            </h3>
            {isDayReportLoading && <Loader2 className="animate-spin text-gray-300" size={18} />}
          </div>

          {!isDayReportLoading && dayReport && dayReport.products.length === 0 && (
            <p className="text-gray-300 font-bold uppercase text-xs tracking-widest text-center py-10">
              No deliveries, damages, or close-day records for this date yet.
            </p>
          )}

          {dayReport && dayReport.products.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Received</p>
                  <p className="text-lg font-black text-gray-800">{formatMoney(dayReport.receivedValue)}</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">− Damages</p>
                  <p className="text-lg font-black text-red-600">{formatMoney(dayReport.damagedValue)}</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">− Close Day</p>
                  <p className="text-lg font-black text-orange-600">{formatMoney(dayReport.closeDayValue)}</p>
                </div>
                <div className="bg-[#5D4037] rounded-2xl p-4">
                  <p className="text-[9px] font-black text-[#EBE0CC] uppercase tracking-widest">= Revenue</p>
                  <p className="text-lg font-black text-white">{formatMoney(dayReport.revenue)}</p>
                </div>
              </div>
              {dayReport.distributedValue > 0 && (
                <p className="text-[10px] text-gray-400 font-bold mb-4">
                  Also excludes {formatMoney(dayReport.distributedValue)} given out to events/clients/samples (distributed, not sold).
                </p>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[9px] font-black uppercase text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="py-2 pr-4">Product</th>
                      <th className="py-2 px-2 text-center">Received</th>
                      <th className="py-2 px-2 text-center">Damaged</th>
                      <th className="py-2 px-2 text-center">Close Day</th>
                      <th className="py-2 px-2 text-center">Sold</th>
                      <th className="py-2 pl-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-bold">
                    {dayReport.products.map((p) => (
                      <tr key={p.product_id}>
                        <td className="py-2 pr-4 text-[#5D4037] uppercase text-xs">{p.product_name}</td>
                        <td className="py-2 px-2 text-center">{p.delivered_qty}</td>
                        <td className="py-2 px-2 text-center text-red-500">{p.damaged_qty}</td>
                        <td className="py-2 px-2 text-center text-orange-500">{p.remaining_qty + p.expired_qty}</td>
                        <td className="py-2 px-2 text-center text-green-600">{p.sold_qty}</td>
                        <td className="py-2 pl-2 text-right">{formatMoney(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- PRODUCT PERFORMANCE --- */}
      {activeView === 'Performance' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-black text-[#5D4037] uppercase text-xs">{pageInfo}</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400">
              <tr>
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4 text-center">Sold</th>
                <th className="px-8 py-4 text-center">Stock</th>
                <th className="px-8 py-4 text-center">Damaged</th>
                <th className="px-8 py-4 text-center">Popularity</th>
                <th className="px-8 py-4">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {performance.map((row) => (
                <tr key={row.id} className="text-sm font-bold">
                  <td className="px-8 py-4 text-[#5D4037] uppercase">{row.name}</td>
                  <td className="px-8 py-4 text-center">{row.totalSold}</td>
                  <td className="px-8 py-4 text-center text-gray-500">{row.stock}</td>
                  <td className="px-8 py-4 text-center text-red-500">{row.damaged}</td>
                  <td className="px-8 py-4 text-center">{row.popularity}%</td>
                  <td className="px-8 py-4 text-[11px] text-gray-400 italic">{row.recommendation}</td>
                </tr>
              ))}
              {performance.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center text-gray-400 font-bold italic">
                    No product performance data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- LOSSES (DAMAGE AUDIT LOG) --- */}
      {activeView === 'Losses' && (
        <div className="bg-white rounded-[40px] border-2 border-red-50 shadow-xl overflow-hidden animate-in slide-in-from-right-4">
          <div className="p-6 border-b border-red-50 flex items-center justify-between bg-red-50/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="font-black text-red-600 uppercase tracking-widest text-sm">Damage Audit Log</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Non-recoverable financial losses</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-red-50/10 text-red-400 text-[10px] uppercase font-black tracking-widest border-b border-red-50">
                <tr>
                  <th className="px-8 py-5">Product Name</th>
                  <th className="px-8 py-5">Location</th>
                  <th className="px-8 py-5">Reported By</th>
                  <th className="px-8 py-5 text-center">Qty Damaged</th>
                  <th className="px-8 py-5">Reason / Note</th>
                  <th className="px-8 py-5 text-right font-black">Financial Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50/50">
                {filteredDamage.map((row) => (
                  <tr key={row.id} className="hover:bg-red-50/10 transition-colors">
                    <td className="px-8 py-5 font-black text-gray-900 text-sm uppercase">{row.product || 'Unknown'}</td>
                    <td className="px-8 py-5">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded-md">
                        <MapPin size={12} /> {row.location} · {row.date}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-500">{row.reported_by}</td>
                    <td className="px-8 py-5 text-center font-black text-red-600 text-lg">{row.quantity}</td>
                    <td className="px-8 py-5">
                      <span className="text-[11px] font-bold italic text-gray-400">{row.reason || 'No reason given'}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-red-600 bg-red-50/20">
                      {formatMoney(row.quantity * (row.cost || 0))}
                    </td>
                  </tr>
                ))}
                {filteredDamage.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center text-gray-400 font-bold italic">
                      Excellent! No damages recorded for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- VIEW SWITCHER (Performance tab entry point) --- */}
      {activeView === 'Overview' && !activeDay && (
        <div className="flex justify-center print:hidden">
          <button
            onClick={() => setActiveView('Performance')}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#5D4037] transition-colors"
          >
            View Product Performance →
          </button>
        </div>
      )}
    </div>
  );
}