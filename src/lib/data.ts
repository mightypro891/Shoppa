import type { Product } from './types';

const products: Product[] = [
  {
    id: '1',
    name: 'Garri (Ijebu)',
    price: 15.0,
    image: 'https://picsum.photos/400/300?random=1',
    description: 'Crisp, sour, and fine-grained, perfect for soaking or making Eba.',
    aiHint: 'grain powder',
    tags: ['grains', 'swallows']
  },
  {
    id: '2',
    name: 'Poundo Yam',
    price: 25.0,
    image: 'https://picsum.photos/400/300?random=2',
    description: 'A smooth, fluffy swallow made from yam flour. A staple for any soup.',
    aiHint: 'yam flour',
    tags: ['swallows']
  },
  {
    id: '3',
    name: 'Egusi (Ground)',
    price: 12.5,
    image: 'https://picsum.photos/400/300?random=3',
    description: 'Ground melon seeds, the essential ingredient for the iconic Egusi soup.',
    aiHint: 'ground seeds',
    tags: ['grains']
  },
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
    id: '5',
    name: 'Plantain (Ripe)',
    price: 5.0,
    image: 'https://picsum.photos/400/300?random=5',
    description: 'Sweet and versatile, perfect for frying as dodo or boiling.',
    aiHint: 'plantain',
    tags: ['plantain']
  },
  {
    id: '6',
    name: 'Ogbono (Ground)',
    price: 14.0,
    image: 'https://picsum.photos/400/300?random=6',
    description: 'Ground African bush mango seeds, known for creating a delicious draw soup.',
    aiHint: 'ground seeds',
    tags: ['grains', 'swallows']
  },
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
    id: '8',
    name: 'Indomie Noodles',
    price: 8.0,
    image: 'https://picsum.photos/400/300?random=8',
    description: 'The ultimate student comfort food. Quick, easy, and satisfying.',
    aiHint: 'instant noodles',
    tags: ['grains']
  },
];

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const product = products.find((p) => p.id === id);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return product;
}
