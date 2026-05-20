"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PayrollBreakdownChartProps {
  data: { name: string; total: string | number }[];
  formatCurrency: (value: number | string) => string;
}

export function PayrollBreakdownChart({
  data,
  formatCurrency,
}: PayrollBreakdownChartProps) {
  const sortedData = [...data].sort((a, b) => Number(b.total) - Number(a.total));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Pusat Biaya Departemen</CardTitle>
        <CardDescription>Alokasi payroll bulanan per departemen</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ left: 20, right: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              formatter={(value: any) => formatCurrency(value)}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey="total"
              fill="#0077b6"
              radius={[0, 4, 4, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
