"use client";

import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

export default function EditProductClient() {
  const search = useSearchParams();
  const id = search?.get('id') || undefined;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const productData = await getProductById(id);
      if (productData) setProduct(productData);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto py-8">Product not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <ProductForm product={product} />
    </div>
  );
}
