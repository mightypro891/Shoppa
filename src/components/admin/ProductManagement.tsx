
'use client';

import { deleteProduct, getProducts, getDeletedProducts, resetAllProducts } from '@/lib/data';
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
import type { Product, DeletedProduct } from '@/lib/types';
import { PlusCircle, Edit, Trash2, Loader2, History, DatabaseZap } from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { format } from 'date-fns';


export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<DeletedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
        const prods = await getProducts();
        const deletedProds = await getDeletedProducts();
        setProducts(prods);
        setDeletedProducts(deletedProds);
    } catch(e) {
        console.error(e);
        toast({
            title: "Error fetching products",
            description: "Please check console for details",
            variant: "destructive"
        })
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!user || !user.email) {
        toast({ title: 'Authentication Error', description: 'You must be logged in.', variant: 'destructive'});
        return;
    }
    setDeletingId(productId);
    await deleteProduct(productId, user.email);
    toast({
      title: 'Product Deleted',
      description: 'The product has been moved to the deleted products log.',
      variant: 'destructive',
    });
    await fetchProducts(); // Refresh both lists
    setDeletingId(null);
  };
  
  const handleSeed = async () => {
      const result = await resetAllProducts();
      if (result.success) {
        toast({
            title: 'Data Seeded',
            description: result.message,
        });
      } else {
         toast({
            title: 'Seeding Skipped',
            description: result.message,
            variant: 'destructive',
        });
      }
      await fetchProducts();
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
            <div className="flex items-center gap-2">
                 <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline">
                            <History className="mr-2 h-4 w-4" />
                            View Deleted
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Deleted Products Log</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Deleted At</TableHead>
                                        <TableHead>Deleted By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deletedProducts.length > 0 ? deletedProducts.map((dp, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{dp.product.name}</TableCell>
                                            <TableCell>{dp.deletedAt ? format(new Date(dp.deletedAt), 'PPpp') : 'N/A'}</TableCell>
                                            <TableCell>{dp.deletedBy}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center">No products have been deleted.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button asChild>
                    <Link href="/admin/products/add">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>A list of all products in your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Sale Price</TableHead>
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
                                <TableCell>
                                    {product.salePrice ? (
                                        <span className="font-semibold text-destructive">₦{product.salePrice.toFixed(2)}</span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
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
                </div>
                 {products.length === 0 && !loading && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No products found in the database.</p>
                         <Button onClick={handleSeed} className="mt-4">
                            <DatabaseZap className="mr-2 h-4 w-4" />
                            Seed Initial Products
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
