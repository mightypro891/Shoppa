
import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
    title: 'About Us - Lautech Shoppa',
    description: 'Learn more about our mission, vision, and the team behind Lautech Shoppa.',
};

export default function AboutPage() {
    return <AboutPageClient />;
}
