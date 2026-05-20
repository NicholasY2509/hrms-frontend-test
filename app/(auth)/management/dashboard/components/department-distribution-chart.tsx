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

interface DepartmentDistributionChartProps {
  data: { name: string; count: number }[];
}

export function DepartmentDistributionChart({
  data,
}: DepartmentDistributionChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Distribusi Departemen</CardTitle>
        <CardDescription>Alokasi karyawan di seluruh unit organisasi</CardDescription>
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
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey="count"
              fill="#023e8a"
              radius={[0, 4, 4, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
