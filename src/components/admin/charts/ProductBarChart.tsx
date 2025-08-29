
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const data = [
  { name: 'Garri', total: Math.floor(Math.random() * 500) + 200 },
  { name: 'P. Yam', total: Math.floor(Math.random() * 400) + 150 },
  { name: 'Egusi', total: Math.floor(Math.random() * 600) + 250 },
  { name: 'P. Oil', total: Math.floor(Math.random() * 300) + 100 },
  { name: 'Plantain', total: Math.floor(Math.random() * 700) + 300 },
  { name: 'Ogbono', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'S. Fish', total: Math.floor(Math.random() * 450) + 200 },
];

export default function ProductBarChart() {
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
