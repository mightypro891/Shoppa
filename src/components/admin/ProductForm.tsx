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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { addProduct } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  image: z.any().refine(
      (val) => (val instanceof FileList && val.length > 0) || typeof val === 'string', 
      'Please upload an image.'
    ),
  aiHint: z.string().min(2, 'AI hint must be at least 2 characters.'),
  tags: z.string().min(1, 'Please select a category.'),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, managedCategories, adminRole } = useAuth();
  const isEditing = !!product;

  const allCategories = ['food', 'skin-care', 'gadgets', 'kitchen-utensils', 'beddings', 'home-decors', 'intimate-apparel'];
  const availableCategories = adminRole === 'Normal Admin' ? (managedCategories || []) : allCategories;


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      description: product?.description || '',
      image: product?.image || '',
      aiHint: product?.aiHint || '',
      tags: product?.tags?.join(', ') || '',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!user) return;
    
    let imageUrl = product?.image || 'https://picsum.photos/400/300?random=9'; // Default placeholder

    if (data.image instanceof FileList && data.image.length > 0) {
      imageUrl = URL.createObjectURL(data.image[0]);
    } else if (typeof data.image === 'string') {
      imageUrl = data.image;
    }


    const productData: Omit<Product, 'id'> = {
      name: data.name,
      price: data.price,
      description: data.description,
      image: imageUrl,
      aiHint: data.aiHint,
      tags: data.tags.split(',').map(tag => tag.trim()),
      vendorId: adminRole === 'Normal Admin' ? user.email : 'admin@lautechshoppa.com', // Use email as vendorId for prototype
    };

    if (isEditing) {
       // Update logic would go here
      console.log('Updating product not yet implemented');
    } else {
      await addProduct(productData);
    }

    toast({
      title: isEditing ? 'Product Updated' : 'Product Created',
      description: `The product "${data.name}" has been saved.`,
    });

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
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
                        {isEditing && typeof product?.image === 'string' && `Current image: ${product.image.split('/').pop()}`}
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
                    <Button type="submit">{isEditing ? 'Save Changes' : 'Create Product'}</Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
