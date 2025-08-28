
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/data";
import { Metadata } from "next";
import { notFound } from "next/navigation";


type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id);
  return {
    title: `Edit ${product?.name || 'Product'} - Naija Shoppa`,
  }
}


export default async function EditProductPage({ params }: { params: { id: string }}) {
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8">
            <ProductForm product={product} />
        </div>
    )
}
