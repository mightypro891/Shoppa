
import type { Product } from './types';

// This is a temporary in-memory store for our products.
// In a real application, this would be a database.
let products: Product[] = [
    // Food
    {
        id: '1',
        name: 'Ofada Rice',
        price: 3000.0,
        image: 'https://picsum.photos/400/300?random=1',
        description: 'Aromatic, locally grown short-grain rice with a unique nutty flavor. Perfect for Ofada stew.',
        aiHint: 'local rice',
        tags: ['food']
    },
    {
        id: '2',
        name: 'Long Grain Parboiled Rice',
        price: 2500.0,
        image: 'https://picsum.photos/400/300?random=2',
        description: 'A versatile staple, fluffy and separate when cooked. Ideal for Jollof rice and fried rice.',
        aiHint: 'white rice',
        tags: ['food']
    },
    {
        id: '11',
        name: 'Black Eyed Beans (Oloyin)',
        price: 1800.0,
        image: 'https://picsum.photos/400/300?random=11',
        description: 'Sweet, honey-flavored brown beans. A favorite for making Ewa Aganyin or bean porridge.',
        aiHint: 'brown beans',
        tags: ['food']
    },
    {
        id: '12',
        name: 'Garri (Ijebu)',
        price: 1500.0,
        image: 'https://picsum.photos/400/300?random=12',
        description: 'Crisp, sour, and fine-grained, perfect for soaking or making Eba.',
        aiHint: 'grain powder',
        tags: ['food']
    },
     {
        id: '13',
        name: 'Garri (Yellow)',
        price: 1500.0,
        image: 'https://picsum.photos/400/300?random=13',
        description: 'Fortified with palm oil, giving it a yellow color and a smoother texture for Eba.',
        aiHint: 'yellow powder',
        tags: ['food']
    },
    {
        id: '15',
        name: 'Poundo Yam',
        price: 2500.0,
        image: 'https://picsum.photos/400/300?random=15',
        description: 'A smooth, fluffy swallow made from yam flour. A staple for any soup.',
        aiHint: 'yam flour',
        tags: ['food']
    },
    {
        id: '3',
        name: 'Egusi (Ground)',
        price: 1250.0,
        image: 'https://picsum.photos/400/300?random=3',
        description: 'Ground melon seeds, the essential ingredient for the iconic Egusi soup.',
        aiHint: 'ground seeds',
        tags: ['food']
    },
    {
        id: '4',
        name: 'Palm Oil',
        price: 1800.0,
        image: 'https://picsum.photos/400/300?random=4',
        description: 'Rich, flavorful, and red, this oil is the soul of Nigerian cooking.',
        aiHint: 'red oil',
        tags: ['food']
    },
    {
        id: '7',
        name: 'Smoked Catfish',
        price: 2200.0,
        image: 'https://picsum.photos/400/300?random=7',
        description: 'A smoky, savory fish that adds deep flavor to soups and stews.',
        aiHint: 'smoked fish',
        tags: ['food']
    },
    {
        id: '5',
        name: 'Plantain (Ripe)',
        price: 500.0,
        image: 'https://picsum.photos/400/300?random=5',
        description: 'Sweet and versatile, perfect for frying as dodo or boiling.',
        aiHint: 'plantain',
        tags: ['food']
    },

    // Skin Care
    {
        id: '21',
        name: 'Luxury Oud Perfume',
        price: 15000.0,
        image: 'https://picsum.photos/400/300?random=21',
        description: 'An exotic and long-lasting fragrance with deep woody notes.',
        aiHint: 'perfume bottle',
        tags: ['skin-care']
    },
    {
        id: '22',
        name: 'Vitamin C Face Serum',
        price: 8500.0,
        image: 'https://picsum.photos/400/300?random=22',
        description: 'Brightens and revitalizes skin, reducing dark spots for a radiant glow.',
        aiHint: 'skincare product',
        tags: ['skin-care']
    },
    {
        id: '23',
        name: 'Argan Oil Hair Treatment',
        price: 6000.0,
        image: 'https://picsum.photos/400/300?random=23',
        description: 'Nourishes and repairs damaged hair, leaving it soft, silky, and strong.',
        aiHint: 'hair product',
        tags: ['skin-care']
    },
    {
        id: '24',
        name: 'Silk Head Scarf',
        price: 4500.0,
        image: 'https://picsum.photos/400/300?random=24',
        description: 'A beautiful and elegant silk scarf, perfect for protecting hair or as a fashion accessory.',
        aiHint: 'silk scarf',
        tags: ['skin-care']
    },
    {
        id: '25',
        name: 'Gold Plated Necklace',
        price: 12000.0,
        image: 'https://picsum.photos/400/300?random=25',
        description: 'Elegant gold plated jewelry to complement any outfit.',
        aiHint: 'gold necklace',
        tags: ['skin-care']
    },
    
    // Gadgets
    {
        id: '26',
        name: 'Ultra-Thin Laptop',
        price: 450000.0,
        image: 'https://picsum.photos/400/300?random=26',
        description: 'A powerful and lightweight laptop for work, study, and entertainment on the go.',
        aiHint: 'laptop computer',
        tags: ['gadgets']
    },
    {
        id: '27',
        name: 'Wireless Mouse',
        price: 7500.0,
        image: 'https://picsum.photos/400/300?random=27',
        description: 'Ergonomic wireless mouse with a long-lasting battery for seamless productivity.',
        aiHint: 'computer mouse',
        tags: ['gadgets']
    },
    {
        id: '28',
        name: 'USB-C Hub',
        price: 12000.0,
        image: 'https://picsum.photos/400/300?random=28',
        description: 'Expand your laptop\'s connectivity with this multi-port USB-C hub.',
        aiHint: 'usb hub',
        tags: ['gadgets']
    },

    // Kitchen Utensils
    {
        id: '29',
        name: 'Non-Stick Pot Set',
        price: 25000.0,
        image: 'https://picsum.photos/400/300?random=29',
        description: 'A complete set of durable non-stick pots for all your cooking needs.',
        aiHint: 'cooking pots',
        tags: ['kitchen-utensils']
    },
    {
        id: '30',
        name: 'Stainless Steel Knife Set',
        price: 18000.0,
        image: 'https://picsum.photos/400/300?random=30',
        description: 'High-quality, sharp stainless steel knives with a wooden block.',
        aiHint: 'knife set',
        tags: ['kitchen-utensils']
    },

    // Beddings
    {
        id: '31',
        name: 'Cotton Bed Sheet Set',
        price: 20000.0,
        image: 'https://picsum.photos/400/300?random=31',
        description: 'Soft and breathable 100% cotton bed sheets for a comfortable night\'s sleep.',
        aiHint: 'bed sheets',
        tags: ['beddings']
    },
    {
        id: '32',
        name: 'Duvet Comforter',
        price: 35000.0,
        image: 'https://picsum.photos/400/300?random=32',
        description: 'A plush and warm duvet to keep you cozy during cold nights.',
        aiHint: 'duvet comforter',
        tags: ['beddings']
    },

    // Home Decors
    {
        id: '33',
        name: 'Abstract Wall Art',
        price: 15000.0,
        image: 'https://picsum.photos/400/300?random=33',
        description: 'Modern abstract canvas painting to beautify your living space.',
        aiHint: 'wall art',
        tags: ['home-decors']
    },
    {
        id: '34',
        name: 'Scented Candle',
        price: 5000.0,
        image: 'https://picsum.photos/400/300?random=34',
        description: 'A lavender-scented candle to create a relaxing and calming atmosphere.',
        aiHint: 'scented candle',
        tags: ['home-decors']
    },

    // Intimate Apparel
    {
        id: '35',
        name: 'Lace Bralette Set',
        price: 9500.0,
        image: 'https://picsum.photos/400/300?random=35',
        description: 'A comfortable and elegant lace bralette and panty set.',
        aiHint: 'lace lingerie',
        tags: ['intimate-apparel']
    },
    {
        id: '36',
        name: 'Silk Pajama Set',
        price: 18000.0,
        image: 'https://picsum.photos/400/300?random=36',
        description: 'Luxurious silk pajamas for a comfortable and stylish night.',
        aiHint: 'silk pajamas',
        tags: ['intimate-apparel']
    }
];

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const product = products.find((p) => p.id === id);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return product;
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newProduct: Product = {
    ...productData,
    id: (products.length + 1).toString(),
  };
  products.unshift(newProduct); // Add to the beginning of the array
  return newProduct;
}
