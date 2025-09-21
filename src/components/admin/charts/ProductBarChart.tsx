
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { useEffect, useState } from 'react';

const generateData = (category: string) => {
    const dataByCategory: { [key: string]: { name: string, total: number }[] } = {
      all: [
        { name: 'Garri', total: Math.floor(Math.random() * 500) + 200 },
        { name: 'P. Yam', total: Math.floor(Math.random() * 400) + 150 },
        { name: 'Perfume', total: Math.floor(Math.random() * 300) + 100 },
        { name: 'Laptop', total: Math.floor(Math.random() * 700) + 300 },
        { name: 'Pots', total: Math.floor(Math.random() * 200) + 50 },
        { name: 'Duvet', total: Math.floor(Math.random() * 450) + 200 },
        { name: 'PJs', total: Math.floor(Math.random() * 250) + 70 },
      ],
      food: [
        { name: 'Garri', total: Math.floor(Math.random() * 500) + 200 },
        { name: 'P. Yam', total: Math.floor(Math.random() * 400) + 150 },
        { name: 'Egusi', total: Math.floor(Math.random() * 600) + 250 },
        { name: 'P. Oil', total: Math.floor(Math.random() * 300) + 100 },
        { name: 'Plantain', total: Math.floor(Math.random() * 700) + 300 },
      ],
      'skin-care': [
        { name: 'Perfume', total: Math.floor(Math.random() * 300) + 100 },
        { name: 'Serum', total: Math.floor(Math.random() * 250) + 80 },
        { name: 'Hair Oil', total: Math.floor(Math.random() * 200) + 60 },
      ],
      gadgets: [
        { name: 'Laptop', total: Math.floor(Math.random() * 700) + 300 },
        { name: 'Mouse', total: Math.floor(Math.random() * 150) + 50 },
        { name: 'Hub', total: Math.floor(Math.random() * 200) + 75 },
      ],
    };
    return dataByCategory[category] || dataByCategory['all'];
};


interface ProductBarChartProps {
  category: string;
}

export default function ProductBarChart({ category }: ProductBarChartProps) {
  const [data, setData] = useState<{ name: string, total: number }[]>([]);

  useEffect(() => {
    setData(generateData(category));
  }, [category]);
  
  if (data.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales by Product</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="flex items-center justify-center h-[350px]">
                    <p className="text-muted-foreground">Loading chart data...</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${value}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
}
