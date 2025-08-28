
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden bg-card border-2 border-transparent hover:border-primary transition-all duration-300 shadow-md hover:shadow-xl group">
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              data-ai-hint={product.aiHint}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-bold font-headline mb-1">{product.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
