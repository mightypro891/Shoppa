
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

const allChartData = [
  { category: 'Food', sold: 485, fill: 'var(--color-food)' },
  { category: 'Skin Care', sold: 287, fill: 'var(--color-skin-care)' },
  { category: 'Gadgets', sold: 220, fill: 'var(--color-gadgets)' },
  { category: 'Kitchen', sold: 173, fill: 'var(--color-kitchen)' },
  { category: 'Beddings', sold: 150, fill: 'var(--color-beddings)' },
  { category: 'Decor', sold: 90, fill: 'var(--color-decor)' },
  { category: 'Apparel', sold: 110, fill: 'var(--color-apparel)' },
];

const foodChartData = [
  { category: 'Grains', sold: 275, fill: 'var(--color-grains)' },
  { category: 'Swallows', sold: 200, fill: 'var(--color-swallows)' },
  { category: 'Oils', sold: 187, fill: 'var(--color-oils)' },
  { category: 'Fish', sold: 173, fill: 'var(--color-fish)' },
  { category: 'Spices', sold: 90, fill: 'var(--color-spices)' },
];

const chartConfig = {
  sold: {
    label: 'Units Sold',
  },
  food: { label: 'Food', color: 'hsl(var(--chart-1))' },
  'skin-care': { label: 'Skin Care', color: 'hsl(var(--chart-2))' },
  gadgets: { label: 'Gadgets', color: 'hsl(var(--chart-3))' },
  kitchen: { label: 'Kitchen', color: 'hsl(var(--chart-4))' },
  beddings: { label: 'Beddings', color: 'hsl(var(--chart-5))' },
  decor: { label: 'Decor', color: 'hsl(var(--chart-1))' },
  apparel: { label: 'Apparel', color: 'hsl(var(--chart-2))' },
  grains: { label: 'Grains', color: 'hsl(var(--chart-1))' },
  swallows: { label: 'Swallows', color: 'hsl(var(--chart-2))' },
  oils: { label: 'Oils', color: 'hsl(var(--chart-3))' },
  fish: { label: 'Fish', color: 'hsl(var(--chart-4))' },
  spices: { label: 'Spices', color: 'hsl(var(--chart-5))' },
};


interface ProductPieChartProps {
  category: string;
}

export default function ProductPieChart({ category }: ProductPieChartProps) {
  const chartData = category === 'food' ? foodChartData : allChartData;
  const title = category === 'food' ? 'Sales by Food Sub-Category' : 'Sales by Category';

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
