
import AppLayout from "@/app/(app)/layout";
import ProductForm from "@/components/admin/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Add Product - Lautech Shoppa',
    description: 'Add a new product to the store.',
};

export default function AddProductPage() {
    return (
        <AppLayout>
            <div className="container mx-auto py-8">
                <ProductForm />
            </div>
        </AppLayout>
    )
}
