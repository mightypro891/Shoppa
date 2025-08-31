
import type { Product } from './types';

// This is a temporary in-memory store for our products.
// In a real application, this would be a database.
let products: Product[] = [
    // Food
    {
        id: '1',
        name: 'Ofada Rice',
        price: 3000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fofada-rice.jpg?alt=media&token=e9d50937-255d-4f1b-8c63-44143494773c',
        description: 'Aromatic, locally grown short-grain rice with a unique nutty flavor. Perfect for Ofada stew.',
        aiHint: 'local rice',
        tags: ['food']
    },
    {
        id: '2',
        name: 'Long Grain Parboiled Rice',
        price: 2500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fparboiled-rice.jpg?alt=media&token=7a9a1b1b-5b5c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A versatile staple, fluffy and separate when cooked. Ideal for Jollof rice and fried rice.',
        aiHint: 'white rice',
        tags: ['food']
    },
    {
        id: '11',
        name: 'Black Eyed Beans (Oloyin)',
        price: 1800.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Foloyin-beans.jpg?alt=media&token=0b3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Sweet, honey-flavored brown beans. A favorite for making Ewa Aganyin or bean porridge.',
        aiHint: 'brown beans',
        tags: ['food']
    },
    {
        id: '12',
        name: 'Garri (Ijebu)',
        price: 1500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fijebu-garri.jpg?alt=media&token=e8a1d82e-9f3a-4e2b-8c63-44143494773c',
        description: 'Crisp, sour, and fine-grained, perfect for soaking or making Eba.',
        aiHint: 'grain powder',
        tags: ['food']
    },
     {
        id: '13',
        name: 'Garri (Yellow)',
        price: 1500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fyellow-garri.jpg?alt=media&token=a8d5f9b1-5f6e-4b2c-8f3a-9e1e2c6f1d2e',
        description: 'Fortified with palm oil, giving it a yellow color and a smoother texture for Eba.',
        aiHint: 'yellow powder',
        tags: ['food']
    },
    {
        id: '15',
        name: 'Poundo Yam',
        price: 2500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fpoundo-yam.jpg?alt=media&token=b3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A smooth, fluffy swallow made from yam flour. A staple for any soup.',
        aiHint: 'yam flour',
        tags: ['food']
    },
    {
        id: '3',
        name: 'Egusi (Ground)',
        price: 1250.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fegusi.jpg?alt=media&token=c8a1d82e-9f3a-4e2b-8c63-44143494773c',
        description: 'Ground melon seeds, the essential ingredient for the iconic Egusi soup.',
        aiHint: 'ground seeds',
        tags: ['food']
    },
    {
        id: '4',
        name: 'Palm Oil',
        price: 1800.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fpalm-oil.jpg?alt=media&token=d8a1d82e-9f3a-4e2b-8c63-44143494773c',
        description: 'Rich, flavorful, and red, this oil is the soul of Nigerian cooking.',
        aiHint: 'red oil',
        tags: ['food']
    },
    {
        id: '7',
        name: 'Smoked Catfish',
        price: 2200.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fsmoked-fish.jpg?alt=media&token=f8a1d82e-9f3a-4e2b-8c63-44143494773c',
        description: 'A smoky, savory fish that adds deep flavor to soups and stews.',
        aiHint: 'smoked fish',
        tags: ['food']
    },
    {
        id: '5',
        name: 'Plantain (Ripe)',
        price: 500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fplantain.jpg?alt=media&token=0c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Sweet and versatile, perfect for frying as dodo or boiling.',
        aiHint: 'plantain',
        tags: ['food']
    },

    // Skin Care
    {
        id: '21',
        name: 'Luxury Oud Perfume',
        price: 15000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Foud-perfume.jpg?alt=media&token=1c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'An exotic and long-lasting fragrance with deep woody notes.',
        aiHint: 'perfume bottle',
        tags: ['skin-care']
    },
    {
        id: '22',
        name: 'Vitamin C Face Serum',
        price: 8500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fface-serum.jpg?alt=media&token=2c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Brightens and revitalizes skin, reducing dark spots for a radiant glow.',
        aiHint: 'skincare product',
        tags: ['skin-care']
    },
    {
        id: '23',
        name: 'Argan Oil Hair Treatment',
        price: 6000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fhair-treatment.jpg?alt=media&token=3c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Nourishes and repairs damaged hair, leaving it soft, silky, and strong.',
        aiHint: 'hair product',
        tags: ['skin-care']
    },
    {
        id: '24',
        name: 'Silk Head Scarf',
        price: 4500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fsilk-scarf.jpg?alt=media&token=4c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A beautiful and elegant silk scarf, perfect for protecting hair or as a fashion accessory.',
        aiHint: 'silk scarf',
        tags: ['skin-care']
    },
    {
        id: '25',
        name: 'Gold Plated Necklace',
        price: 12000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fgold-necklace.jpg?alt=media&token=5c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Elegant gold plated jewelry to complement any outfit.',
        aiHint: 'gold necklace',
        tags: ['skin-care']
    },
    
    // Gadgets
    {
        id: '26',
        name: 'Ultra-Thin Laptop',
        price: 450000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Flaptop.jpg?alt=media&token=6c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A powerful and lightweight laptop for work, study, and entertainment on the go.',
        aiHint: 'laptop computer',
        tags: ['gadgets']
    },
    {
        id: '27',
        name: 'Wireless Mouse',
        price: 7500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fwireless-mouse.jpg?alt=media&token=7c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Ergonomic wireless mouse with a long-lasting battery for seamless productivity.',
        aiHint: 'computer mouse',
        tags: ['gadgets']
    },
    {
        id: '28',
        name: 'USB-C Hub',
        price: 12000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fusbc-hub.jpg?alt=media&token=8c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Expand your laptop\'s connectivity with this multi-port USB-C hub.',
        aiHint: 'usb hub',
        tags: ['gadgets']
    },

    // Kitchen Utensils
    {
        id: '29',
        name: 'Non-Stick Pot Set',
        price: 25000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fpot-set.jpg?alt=media&token=9c3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A complete set of durable non-stick pots for all your cooking needs.',
        aiHint: 'cooking pots',
        tags: ['kitchen-utensils']
    },
    {
        id: '30',
        name: 'Stainless Steel Knife Set',
        price: 18000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fknife-set.jpg?alt=media&token=ac3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'High-quality, sharp stainless steel knives with a wooden block.',
        aiHint: 'knife set',
        tags: ['kitchen-utensils']
    },

    // Beddings
    {
        id: '31',
        name: 'Cotton Bed Sheet Set',
        price: 20000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fbed-sheets.jpg?alt=media&token=bc3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Soft and breathable 100% cotton bed sheets for a comfortable night\'s sleep.',
        aiHint: 'bed sheets',
        tags: ['beddings']
    },
    {
        id: '32',
        name: 'Duvet Comforter',
        price: 35000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fduvet.jpg?alt=media&token=cc3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A plush and warm duvet to keep you cozy during cold nights.',
        aiHint: 'duvet comforter',
        tags: ['beddings']
    },

    // Home Decors
    {
        id: '33',
        name: 'Abstract Wall Art',
        price: 15000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fwall-art.jpg?alt=media&token=dc3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Modern abstract canvas painting to beautify your living space.',
        aiHint: 'wall art',
        tags: ['home-decors']
    },
    {
        id: '34',
        name: 'Scented Candle',
        price: 5000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fscented-candle.jpg?alt=media&token=ec3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A lavender-scented candle to create a relaxing and calming atmosphere.',
        aiHint: 'scented candle',
        tags: ['home-decors']
    },

    // Intimate Apparel
    {
        id: '35',
        name: 'Lace Bralette Set',
        price: 9500.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Flace-bralette.jpg?alt=media&token=fc3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'A comfortable and elegant lace bralette and panty set.',
        aiHint: 'lace lingerie',
        tags: ['intimate-apparel']
    },
    {
        id: '36',
        name: 'Silk Pajama Set',
        price: 18000.0,
        image: 'https://firebasestorage.googleapis.com/v0/b/naija-shoppa.appspot.com/o/images%2Fsilk-pajamas.jpg?alt=media&token=0d3f5b0a-4b2c-4e8c-8f3a-9e1e2c6f1d2e',
        description: 'Luxurious silk pajamas for a comfortable and stylish night.',
        aiHint: 'silk pajamas',
        tags: ['intimate-apparel']
    }
];


export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const allProducts = await getProducts();
    const product = allProducts.find((p) => p.id === id);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return product;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newProduct: Product = {
    ...productData,
    id: Math.random().toString(36).substr(2, 9),
  };
  products = [newProduct, ...products];
  return newProduct;
}

export async function deleteProduct(productId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    products = products.filter(p => p.id !== productId);
}
