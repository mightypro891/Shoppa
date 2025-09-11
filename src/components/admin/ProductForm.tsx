
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { addProduct, updateProduct, submitDeal } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  salePrice: z.coerce.number().optional().nullable(),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  image: z.any(),
  aiHint: z.string().min(2, 'AI hint must be at least 2 characters.'),
  tags: z.string().min(1, 'Please select a category.'),
  campus: z.enum(['Ogbomoso', 'Iseyin'], { required_error: 'Please select a campus location.' }),
  dealPrice: z.coerce.number().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, managedCategories, adminRole, isSuperAdmin } = useAuth();
  const isEditing = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allCategories = ['food', 'skin-care', 'gadgets', 'kitchen-utensils', 'beddings', 'home-decors', 'intimate-apparel'];
  const availableCategories = adminRole === 'Normal Admin' ? (managedCategories || []) : allCategories;


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      salePrice: product?.salePrice || null,
      description: product?.description || '',
      image: product?.image || '',
      aiHint: product?.aiHint || '',
      tags: product?.tags?.[0] || '',
      campus: product?.campus || 'Ogbomoso',
      dealPrice: undefined,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!user || !user.email) return;
    setIsSubmitting(true);
    
    let imageUrl = product?.image || 'https://picsum.photos/400/300';
    
    if (data.image && data.image[0] instanceof File) {
        const file = data.image[0];
        const storage = getStorage();
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
    }

    const productData: Omit<Product, 'id'> = {
      name: data.name,
      price: data.price,
      // Only Super Admins can set the sale price directly
      salePrice: isSuperAdmin ? data.salePrice || undefined : product?.salePrice,
      description: data.description,
      image: imageUrl,
      aiHint: data.aiHint,
      tags: [data.tags],
      campus: data.campus,
      vendorId: adminRole === 'Normal Admin' ? user.email : 'admin@example.com',
    };

    let newOrUpdatedProduct = product;

    if (isEditing && product) {
       newOrUpdatedProduct = await updateProduct(product.id, productData);
       toast({
        title: 'Product Updated',
        description: `The product "${data.name}" has been saved.`,
      });
    } else {
      newOrUpdatedProduct = await addProduct(productData);
      toast({
        title: 'Product Created',
        description: `The product "${data.name}" has been saved.`,
      });
    }

    // Handle deal submission
    if (isEditing && data.dealPrice && data.dealPrice > 0 && data.dealPrice < data.price) {
        await submitDeal({
            productId: product.id,
            productName: data.name,
            productImage: imageUrl,
            originalPrice: data.price,
            proposedPrice: data.dealPrice,
            submittedBy: user.email,
        });
        toast({
            title: 'Deal Submitted',
            description: `Your deal for "${data.name}" has been submitted for approval.`,
        });
    }

    setIsSubmitting(false);
    router.push('/admin/products');
    router.refresh(); 
  };
  
  const formatCategoryName = (slug: string) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  const imageRef = form.register("image");

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Regular Price</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="e.g. 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {isSuperAdmin && (
                    <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sale Price (Super Admin Only)</FormLabel>
                        <FormControl>
                            <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="e.g. 800" 
                                {...field} 
                                value={field.value ?? ""}
                                onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                            />
                        </FormControl>
                        <FormDescription>
                            Directly set the deal price. This will override any submissions. Leave blank to remove sale price.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
                
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the product..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" {...imageRef} />
                    </FormControl>
                    <FormDescription>
                        {isEditing ? 'Leave blank to keep the current image.' : 'Upload a product image.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="aiHint"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>AI Hint</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 'red oil'" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                  control={form.control}
                  name="campus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus Location</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ogbomoso">Ogbomoso</SelectItem>
                          <SelectItem value="Iseyin">Iseyin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the campus where this product is available.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {formatCategoryName(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                       <FormDescription>
                        {adminRole === 'Normal Admin' && 'You can only select from categories assigned to you.'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>{isEditing ? 'Save Changes' : 'Create Product'}</Button>
                </div>
            </form>
            </Form>
            
            {isEditing && !isSuperAdmin && (
                 <>
                    <Separator className="my-8" />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Submit for "Today's Deals"</h3>
                        <p className="text-sm text-muted-foreground">Propose a sale price for this item. A Super Admin will need to approve it before it goes live.</p>
                         <Form {...form}>
                             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="dealPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Proposed Deal Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder={`e.g. ${product.price * 0.9}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" variant="secondary" disabled={isSubmitting}>Submit Deal for Approval</Button>
                            </form>
                        </Form>
                    </div>
                 </>
            )}
        </CardContent>
    </Card>
  );
}
