
export interface Subcategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

export const mainCategories: Category[] = [
  { name: 'Supermarket', slug: 'supermarket' },
  { name: 'Health & Beauty', slug: 'health-beauty' },
  { name: 'Home & Office', slug: 'home-office' },
  { name: 'Appliances', slug: 'appliances' },
  { name: 'Phones & Tablets', slug: 'phones-tablets' },
  { name: 'Computing', slug: 'computing' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Baby Products', slug: 'baby-products' },
  { name: 'Gaming', slug: 'gaming' },
  {
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    subcategories: [
      { name: 'Guitars', slug: 'guitars' },
      { name: 'Drums & Percussion', slug: 'drums-percussion' },
      { name: 'Keyboards & MIDI', slug: 'keyboards-midi' },
    ],
  },
  {
    name: 'Studio & Live Equipment',
    slug: 'studio-live-equipment',
    subcategories: [
        { name: 'Live Sound & Stage', slug: 'live-sound-stage' },
        { name: 'Studio Recording Equipment', slug: 'studio-recording' },
    ],
  },
];

export const allCategories = mainCategories.flatMap(cat => 
    [cat.slug, ...(cat.subcategories?.map(sub => sub.slug) || [])]
);
