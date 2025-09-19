
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Leaf, ShieldCheck, Truck, Users, Mail, Target, Eye } from "lucide-react";
import Link from "next/link";


const features = [
    {
        icon: <Truck className="h-10 w-10 text-primary" />,
        title: "Swift Delivery",
        description: "Get your orders delivered to your doorstep within hours, not days."
    },
    {
        icon: <Leaf className="h-10 w-10 text-primary" />,
        title: "Quality Products",
        description: "We source directly from trusted suppliers to guarantee authentic and fresh products."
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: "Secure & Easy",
        description: "Shop with confidence using our secure wallet system and easy-to-use platform."
    }
];

const teamMembers = [
    { name: "Promise Oye", role: "Founder & CEO", seed: "101" },
    { name: "Adedoyin Adunni", role: "Lead, Vendor Relations", seed: "102" },
    { name: "Tamara Adedolapo", role: "Head of Operations", seed: "103" },
];


export default function AboutPage() {
    return (
        <div className="bg-background">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 md:py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">About Lautech Shoppa</h1>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
                    We are dedicated to simplifying the lives of students and the entire campus community by providing easy access to essential goods, from fresh foodstuffs to everyday necessities.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild size="lg">
                        <a href="mailto:support@lautechshoppa.com">
                            <Mail className="mr-2 h-5 w-5" /> Contact Us
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="#staff">
                            <Users className="mr-2 h-5 w-5" /> Meet Our Staff
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Mission and Vision Section */}
            <div className="bg-secondary/30 py-16 md:py-20">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="bg-primary/10 p-3 rounded-full mb-4">
                            <Target className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold font-headline mb-3">Our Mission</h2>
                        <p className="text-muted-foreground">
                            To be the most reliable and convenient online marketplace for every student on campus, providing quality products at unbeatable prices with exceptional service.
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <div className="bg-primary/10 p-3 rounded-full mb-4">
                            <Eye className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold font-headline mb-3">Our Vision</h2>
                        <p className="text-muted-foreground">
                           To build a connected campus ecosystem where every need is just a click away, fostering a community built on trust, convenience, and shared success.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="py-16 md:py-24">
                 <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Why Choose Lautech Shoppa?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center p-6 flex flex-col items-center border-2 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                                {feature.icon}
                                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Team Section */}
            <div id="staff" className="bg-secondary/30 py-16 md:py-24 scroll-mt-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Meet Our Team</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="flex flex-col items-center text-center">
                                <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
                                    <AvatarImage src={`https://picsum.photos/seed/${member.seed}/200`} alt={member.name} data-ai-hint="professional portrait" />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-muted-foreground">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
