
'use client';

import { deleteProduct, getProducts } from '@/lib/data';
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
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';


export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    const prods = await getProducts();
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    setDeletingId(productId);
    await deleteProduct(productId);
    toast({
      title: 'Product Deleted',
      description: 'The product has been successfully removed.',
      variant: 'destructive',
    });
    await fetchProducts(); // Refresh the list
    setDeletingId(null);
  };
  
  if (loading && products.length === 0) {
      return (
        <div className="flex items-center justify-center p-10">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive hover:text-destructive"
                                      disabled={deletingId === product.id}
                                  >
                                    {deletingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product
                                    "{product.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Yes, delete it
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {products.length === 0 && !loading && (
                    <div className="text-center py-10 text-muted-foreground">
                        You have not added any products yet.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
