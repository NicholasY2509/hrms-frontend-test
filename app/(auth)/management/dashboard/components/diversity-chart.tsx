"use client";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DiversityChartProps {
  data: { label: string; count: number }[];
}

export function DiversityChart({ data }: DiversityChartProps) {
  // Translate gender labels if they are English
  const translatedData = data.map(item => ({
    ...item,
    label: item.label === 'Male' ? 'Laki-laki' : item.label === 'Female' ? 'Perempuan' : item.label
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Komposisi Gender</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={8}
              dataKey="count"
              nameKey="label"
            >
              <Cell fill="#023e8a" />
              <Cell fill="#0077b6" />
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
