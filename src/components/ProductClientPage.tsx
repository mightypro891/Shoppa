"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppLayout from '@/app/(app)/layout';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db as clientDb } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductClientPage() {
  const search = useSearchParams();
  const id = search.get('id');
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchProduct = async () => {
      try {
        const docRef = doc(clientDb, 'products', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
      } catch (e) {
        console.error('Failed to fetch product', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (!id) {
    return (
      <AppLayout>
        <div className="container mx-auto py-24 text-center">No product specified.</div>
      </AppLayout>
    );
  }

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    </AppLayout>
  );

  if (!product) return (
    <AppLayout>
      <div className="container mx-auto py-24 text-center">Product not found.</div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-primary">₦{(product.salePrice || product.price).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button>Buy Now</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
