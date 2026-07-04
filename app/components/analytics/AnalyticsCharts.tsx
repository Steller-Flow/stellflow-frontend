"use client";

import {
  BarChart3,
  DollarSign,
  FileText,
  LockKeyhole,
  PieChart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const monthlyEarnings = [
  { month: "Jan", earnings: 4200, expenses: 1200 },
  { month: "Feb", earnings: 5800, expenses: 1800 },
  { month: "Mar", earnings: 7200, expenses: 2100 },
  { month: "Apr", earnings: 6100, expenses: 1900 },
  { month: "May", earnings: 8900, expenses: 2400 },
  { month: "Jun", earnings: 10200, expenses: 2800 },
  { month: "Jul", earnings: 9400, expenses: 2200 },
  { month: "Aug", earnings: 11800, expenses: 3100 },
  { month: "Sep", earnings: 12500, expenses: 2900 },
  { month: "Oct", earnings: 14200, expenses: 3400 },
  { month: "Nov", earnings: 13800, expenses: 3200 },
  { month: "Dec", earnings: 16500, expenses: 3800 },
];

const transactionVolume = [
  { day: "Mon", invoices: 12, escrows: 5 },
  { day: "Tue", invoices: 19, escrows: 8 },
  { day: "Wed", invoices: 15, escrows: 6 },
  { day: "Thu", invoices: 22, escrows: 11 },
  { day: "Fri", invoices: 18, escrows: 9 },
  { day: "Sat", invoices: 8, escrows: 3 },
  { day: "Sun", invoices: 5, escrows: 2 },
];

const paymentMethods = [
  { name: "USDC", value: 68, color: "#456827" },
  { name: "XLM", value: 22, color: "#8cb369" },
  { name: "USD", value: 10, color: "#d9dff5" },
];

const statCards = [
  {
    label: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-primary-tint text-primary",
  },
  {
    label: "Invoices Sent",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
    color: "bg-status-info/10 text-status-info",
  },
  {
    label: "Active Escrows",
    value: "23",
    change: "+15.3%",
    trend: "up",
    icon: LockKeyhole,
    color: "bg-secondary-container text-secondary",
  },
  {
    label: "Avg. Settlement",
    value: "2.4s",
    change: "-0.3s",
    trend: "down",
    icon: TrendingUp,
    color: "bg-status-success/10 text-status-success",
  },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-divider bg-card-bg p-md shadow-lg">
        <p className="mb-sm font-semibold text-text-primary">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-text-secondary">
            <span className="inline-block h-2 w-2 rounded-full bg-primary mr-sm" />
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsCharts() {
  return (
    <div className="space-y-lg">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <span
                  className={`flex items-center gap-xs text-sm font-semibold ${
                    stat.trend === "up" ? "text-status-success" : "text-status-error"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="mt-md text-sm font-medium text-text-secondary">
                {stat.label}
              </p>
              <p className="font-display mt-xs text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
        {/* Monthly Earnings Chart */}
        <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
          <div className="mb-lg flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Monthly Earnings
            </h3>
            <BarChart3 size={20} className="text-text-muted" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEarnings}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#456827" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#456827" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#eceff3" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#eceff3" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#456827"
                  strokeWidth={2}
                  fill="url(#earningsGradient)"
                  name="Earnings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Volume Chart */}
        <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
          <div className="mb-lg flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Transaction Volume
            </h3>
            <BarChart3 size={20} className="text-text-muted" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff3" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#eceff3" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#eceff3" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="invoices"
                  fill="#456827"
                  radius={[4, 4, 0, 0]}
                  name="Invoices"
                />
                <Bar
                  dataKey="escrows"
                  fill="#8cb369"
                  radius={[4, 4, 0, 0]}
                  name="Escrows"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Methods Distribution */}
      <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
        <div className="mb-lg flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            Payment Method Distribution
          </h3>
          <PieChart size={20} className="text-text-muted" />
        </div>
        <div className="flex flex-col items-center gap-lg md:flex-row md:items-start md:justify-center">
          <div className="h-[250px] w-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Percentage"]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-md">
            {paymentMethods.map((method) => (
              <div key={method.name} className="flex items-center gap-md">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: method.color }}
                />
                <div>
                  <p className="font-semibold text-text-primary">{method.name}</p>
                  <p className="text-sm text-text-secondary">{method.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
