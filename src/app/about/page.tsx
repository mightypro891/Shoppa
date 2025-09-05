
import AppLayout from "@/app/(app)/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Lautech Shoppa",
    description: "Learn more about Lautech Shoppa, your one-stop campus shop.",
};

const features = [
    {
        icon: <Truck className="h-10 w-10 text-primary" />,
        title: "Fast Delivery",
        description: "Get your orders delivered to your doorstep within hours."
    },
    {
        icon: <Leaf className="h-10 w-10 text-primary" />,
        title: "Authentic Products",
        description: "We source directly from trusted suppliers to ensure quality."
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: "Secure Payments",
        description: "Your transactions are safe with our secure payment gateway."
    }
];

export default function AboutPage() {
    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">About Lautech Shoppa</h1>
                    <p className="text-lg text-muted-foreground">
                        Your reliable partner for all your campus needs. We are dedicated to providing students and the campus community with easy access to quality products at the best prices.
                    </p>
                </div>

                <div className="mt-12 md:mt-16">
                    <Card className="bg-secondary/30">
                        <CardHeader>
                            <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-center">Why Choose Lautech Shoppa?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
                                        {feature.icon}
                                        <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
