
import ProductForm from "@/components/admin/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Add Product - Naija Shoppa',
    description: 'Add a new product to the store.',
};

export default function AddProductPage() {
    return (
        <div className="container mx-auto py-8">
            <ProductForm />
        </div>
    )
}
