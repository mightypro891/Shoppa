
'use client';

import { getProducts } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const prods = await getProducts();
      setProducts(prods);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleDelete = (productId: string) => {
    // In a real app, this would be an API call
    console.log(`Deleting product ${productId}`);
    setProducts(products.filter(p => p.id !== productId));
  };
  
  if (loading) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Product Management</h1>
            <Button asChild>
                <Link href="/admin/products/add">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Link>
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>A list of all products in your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(product => (
                        <TableRow key={product.id}>
                            <TableCell>
                               <Image
                                src={product.image}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="rounded-md object-cover"
                                />
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>₦{product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.tags?.join(', ')}</TableCell>
                            <TableCell className="text-right">
                            <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin/products/edit/${product.id}`}>
                                <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(product.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
