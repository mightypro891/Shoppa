
'use client';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartData = [
  { category: 'Grains', sold: 275, fill: 'var(--color-grains)' },
  { category: 'Swallows', sold: 200, fill: 'var(--color-swallows)' },
  { category: 'Oils', sold: 187, fill: 'var(--color-oils)' },
  { category: 'Fishes', sold: 173, fill: 'var(--color-fishes)' },
  { category: 'Spices', sold: 90, fill: 'var(--color-spices)' },
];

const chartConfig = {
  sold: {
    label: 'Units Sold',
  },
  grains: {
    label: 'Grains',
    color: 'hsl(var(--chart-1))',
  },
  swallows: {
    label: 'Swallows',
    color: 'hsl(var(--chart-2))',
  },
  oils: {
    label: 'Oils',
    color: 'hsl(var(--chart-3))',
  },
  fishes: {
    label: 'Fishes',
    color: 'hsl(var(--chart-4))',
  },
  spices: {
    label: 'Spices',
    color: 'hsl(var(--chart-5))',
  },
};

export default function ProductPieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="sold"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
