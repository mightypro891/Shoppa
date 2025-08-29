import type { Product } from './types';

// This is a temporary in-memory store for our products.
// In a real application, this would be a database.
let products: Product[] = [
    // Grains
    {
        id: '1',
        name: 'Ofada Rice',
        price: 30.0,
        image: 'https://picsum.photos/400/300?random=9',
        description: 'Aromatic, locally grown short-grain rice with a unique nutty flavor. Perfect for Ofada stew.',
        aiHint: 'local rice',
        tags: ['grains']
    },
    {
        id: '2',
        name: 'Long Grain Parboiled Rice',
        price: 25.0,
        image: 'https://picsum.photos/400/300?random=11',
        description: 'A versatile staple, fluffy and separate when cooked. Ideal for Jollof rice and fried rice.',
        aiHint: 'white rice',
        tags: ['grains']
    },
    {
        id: '11',
        name: 'Black Eyed Beans (Oloyin)',
        price: 18.0,
        image: 'https://picsum.photos/400/300?random=12',
        description: 'Sweet, honey-flavored brown beans. A favorite for making Ewa Aganyin or bean porridge.',
        aiHint: 'brown beans',
        tags: ['grains']
    },
    {
        id: '12',
        name: 'Garri (Ijebu)',
        price: 15.0,
        image: 'https://picsum.photos/400/300?random=1',
        description: 'Crisp, sour, and fine-grained, perfect for soaking or making Eba.',
        aiHint: 'grain powder',
        tags: ['grains', 'swallows']
    },
     {
        id: '13',
        name: 'Garri (Yellow)',
        price: 15.0,
        image: 'https://picsum.photos/400/300?random=13',
        description: 'Fortified with palm oil, giving it a yellow color and a smoother texture for Eba.',
        aiHint: 'yellow powder',
        tags: ['grains', 'swallows']
    },
     {
        id: '14',
        name: 'White Beans',
        price: 17.0,
        image: 'https://picsum.photos/400/300?random=14',
        description: 'Firm and creamy, great for bean soups, salads, and Moi Moi.',
        aiHint: 'white beans',
        tags: ['grains']
    },
    // Swallows
    {
        id: '15',
        name: 'Poundo Yam',
        price: 25.0,
        image: 'https://picsum.photos/400/300?random=2',
        description: 'A smooth, fluffy swallow made from yam flour. A staple for any soup.',
        aiHint: 'yam flour',
        tags: ['swallows']
    },
    {
        id: '16',
        name: 'Amala (Yam Flour)',
        price: 22.0,
        image: 'https://picsum.photos/400/300?random=15',
        description: 'Made from dried yam peel, this flour creates a distinctive dark, earthy swallow.',
        aiHint: 'dark flour',
        tags: ['swallows']
    },
    {
        id: '17',
        name: 'Semolina',
        price: 20.0,
        image: 'https://picsum.photos/400/300?random=16',
        description: 'A fine, high-wheat flour that produces a light, smooth swallow.',
        aiHint: 'white flour',
        tags: ['swallows']
    },
     // Soups & Spices
    {
        id: '3',
        name: 'Egusi (Ground)',
        price: 12.5,
        image: 'https://picsum.photos/400/300?random=3',
        description: 'Ground melon seeds, the essential ingredient for the iconic Egusi soup.',
        aiHint: 'ground seeds',
        tags: ['grains', 'soups']
    },
    {
        id: '6',
        name: 'Ogbono (Ground)',
        price: 14.0,
        image: 'https://picsum.photos/400/300?random=6',
        description: 'Ground African bush mango seeds, known for creating a delicious draw soup.',
        aiHint: 'ground seeds',
        tags: ['grains', 'soups']
    },
     {
        id: '10',
        name: 'Atarodo (Scotch Bonnet)',
        price: 4.5,
        image: 'https://picsum.photos/400/300?random=10',
        description: 'Fiery and fragrant peppers, essential for adding that signature Nigerian heat.',
        aiHint: 'red peppers',
        tags: ['spices']
    },
    {
        id: '18',
        name: 'Curry Powder',
        price: 5.0,
        image: 'https://picsum.photos/400/300?random=17',
        description: 'A classic blend of spices used to season stews, rice, and meats.',
        aiHint: 'yellow spice',
        tags: ['spices']
    },
    // Oils
    {
        id: '4',
        name: 'Palm Oil',
        price: 18.0,
        image: 'https://picsum.photos/400/300?random=4',
        description: 'Rich, flavorful, and red, this oil is the soul of Nigerian cooking.',
        aiHint: 'red oil',
        tags: ['oils']
    },
    {
        id: '19',
        name: 'Vegetable Oil',
        price: 16.0,
        image: 'https://picsum.photos/400/300?random=18',
        description: 'A light, neutral-tasting oil for all-purpose frying and cooking.',
        aiHint: 'cooking oil',
        tags: ['oils']
    },
    // Proteins & Others
    {
        id: '7',
        name: 'Smoked Catfish',
        price: 22.0,
        image: 'https://picsum.photos/400/300?random=7',
        description: 'A smoky, savory fish that adds deep flavor to soups and stews.',
        aiHint: 'smoked fish',
        tags: ['fishes']
    },
    {
        id: '20',
        name: 'Stockfish (Panla)',
        price: 35.0,
        image: 'https://picsum.photos/400/300?random=19',
        description: 'Air-dried cod, providing a distinct, potent flavor to traditional soups.',
        aiHint: 'dried fish',
        tags: ['fishes']
    },
    {
        id: '5',
        name: 'Plantain (Ripe)',
        price: 5.0,
        image: 'https://picsum.photos/400/300?random=5',
        description: 'Sweet and versatile, perfect for frying as dodo or boiling.',
        aiHint: 'plantain',
        tags: ['plantain']
    },
    {
        id: '8',
        name: 'Indomie Noodles',
        price: 8.0,
        image: 'https://picsum.photos/400/300?random=8',
        description: 'The ultimate student comfort food. Quick, easy, and satisfying.',
        aiHint: 'instant noodles',
        tags: ['grains']
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
