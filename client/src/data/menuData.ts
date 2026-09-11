export type MenuCategory = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'desserts' | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'desserts' | 'drinks';
  price: string;
  description: string;
  badge?: string;
  image: string;
  tastingNote?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
}

export const ALL_MENU_ITEMS: MenuItem[] = [
  // --- FEATURED / TOP RATED 1: LOBSTER & SIRLOIN ---
  {
    id: 'lobster-sirloin',
    name: 'Lobster Thermidor & Wagyu Sirloin',
    category: 'dinner',
    price: '$88',
    description: 'Gratinated Atlantic lobster tail with cognac cream, marbled wagyu sirloin medallions, red wine truffle demi-glace.',
    badge: '★ 5.0 (240+ Reviews) • Chef Crown',
    image: '/images/menu%20images/Gemini_Generated_Image_c4q911c4q911c4q9.webp',
    tastingNote: 'Decadent • Oceanic • Rich',
    rating: 5.0,
    reviewCount: 242,
    featured: true,
  },

  // --- FEATURED / TOP RATED 2: CHILEAN SEA BASS ---
  {
    id: 'sea-bass',
    name: 'Pan-Seared Chilean Sea Bass',
    category: 'dinner',
    price: '$58',
    description: 'Wild-caught Chilean sea bass on slate, yuzu-dashi reduction, delicate micro garden florals & sea salt.',
    badge: '★ 4.9 (195+ Reviews) • Guest Favorite',
    image: '/images/menu%20images/Gemini_Generated_Image_6oueod6oueod6oue.webp',
    tastingNote: 'Buttery • Yuzu Citrus • Elegant',
    rating: 4.9,
    reviewCount: 198,
    featured: true,
  },

  // --- FEATURED / TOP RATED 3: SOUFFLE CLOUD PANCAKES ---
  {
    id: 'souffle-pancakes',
    name: 'Soufflé Honey-Butter Cloud Pancakes',
    category: 'breakfast',
    price: '$28',
    description: 'Japanese-style airy soufflé pancakes, whipped brown butter, wild sea buckthorn berries & roasted pecans.',
    badge: '★ 4.9 (180+ Reviews) • Morning Icon',
    image: '/images/menu%20images/Gemini_Generated_Image_7e0i257e0i257e0i.webp',
    tastingNote: 'Airy • Citrus Blossom • Delicate',
    rating: 4.9,
    reviewCount: 184,
    featured: true,
  },

  // --- BREAKFAST & BRUNCH ---
  {
    id: 'egg-bites',
    name: 'Gruyère & Bacon Sous Vide Egg Bites',
    category: 'breakfast',
    price: '$22',
    description: 'Velvety farm-fresh eggs, applewood smoked bacon, aged Gruyère fondue, fresh berries & glazed walnuts.',
    badge: 'Morning Classic',
    image: '/images/menu%20images/Gemini_Generated_Image_3z2trd3z2trd3z2t.webp',
    tastingNote: 'Silky • Savory • Rich',
    rating: 4.8,
    reviewCount: 112,
  },
  {
    id: 'pancakes-buttermilk',
    name: 'Golden Buttermilk Pancake Stack',
    category: 'breakfast',
    price: '$26',
    description: 'Fluffy cultured buttermilk stack, whipped honeycomb butter, pure Vermont amber maple drizzle.',
    badge: 'House Favorite',
    image: '/images/menu%20images/Gemini_Generated_Image_4qhrpw4qhrpw4qhr.webp',
    tastingNote: 'Fluffy • Honeyed • Warm',
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: 'cinnamon-swirls',
    name: 'Artisan Cinnamon Brioche Swirls',
    category: 'breakfast',
    price: '$19',
    description: 'Freshly baked Ceylon cinnamon brioche, bourbon vanilla cream glaze, candied walnut crumble.',
    badge: 'Freshly Baked',
    image: '/images/menu%20images/Gemini_Generated_Image_lgg97clgg97clgg9.webp',
    tastingNote: 'Aromatic • Warm Spice • Sweet',
    rating: 4.7,
    reviewCount: 94,
  },
  {
    id: 'truffle-hashbrown',
    name: 'Black Truffle Hashbrown Gratin',
    category: 'breakfast',
    price: '$24',
    description: 'Crispy shredded golden potato gratin, sharp parmesan crust, shaved winter truffle oil, smoked lardons.',
    badge: 'Chef Signature',
    image: '/images/menu%20images/Gemini_Generated_Image_pl2ktepl2ktepl2k.webp',
    tastingNote: 'Crispy • Earthy • Decadent',
    rating: 4.8,
    reviewCount: 128,
  },

  // --- LUNCH & RAW BAR ---
  {
    id: 'lettuce-wraps',
    name: 'Artisanal Chicken Lettuce Wraps',
    category: 'lunch',
    price: '$24',
    description: 'Crisp butterhead lettuce leaves, hand-minced poultry, water chestnuts, toasted pine nuts, wok-fired glaze.',
    badge: 'Light & Crisp',
    image: '/images/menu%20images/Gemini_Generated_Image_3ynnpr3ynnpr3ynn.webp',
    tastingNote: 'Crunchy • Umami • Refreshing',
    rating: 4.7,
    reviewCount: 88,
  },
  {
    id: 'broccoli-cheddar-soup',
    name: 'Aged Cheddar Broccoli Velouté',
    category: 'lunch',
    price: '$21',
    description: 'Slow-simmered tender broccoli florets, sharp white cheddar fondue, herb-infused cold-pressed oil.',
    badge: 'Comfort Luxury',
    image: '/images/menu%20images/Gemini_Generated_Image_4zrfst4zrfst4zrf.webp',
    tastingNote: 'Creamy • Sharp • Comforting',
    rating: 4.6,
    reviewCount: 76,
  },
  {
    id: 'harvest-salad',
    name: 'Estate Garden Harvest Bowl',
    category: 'lunch',
    price: '$22',
    description: 'Crisp baby romaine, mild pepperoncini, kalamata olives, shaved aged parmesan, house herb dressing.',
    badge: 'Estate Sourced',
    image: '/images/menu%20images/Gemini_Generated_Image_bmutq4bmutq4bmut.webp',
    tastingNote: 'Zesty • Herbaceous • Crisp',
    rating: 4.7,
    reviewCount: 65,
  },

  // --- DINNER & MAINS ---
  {
    id: 'tournedos-polenta',
    name: 'Tournedos with Polenta & Salsa Verde',
    category: 'dinner',
    price: '$54',
    description: 'Prime beef tournedos pan-seared in brown butter, creamy mascarpone polenta, vibrant caper herb oil.',
    badge: 'Wood-Fired Sear',
    image: '/images/menu%20images/Gemini_Generated_Image_ceu76jceu76jceu7.webp',
    tastingNote: 'Tender • Herbaceous • Robust',
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: 'scallop-carpaccio',
    name: 'Hokkaido Scallop Carpaccio',
    category: 'dinner',
    price: '$32',
    description: 'Thinly sliced raw Hokkaido sea scallops, passionfruit citrus vinaigrette, edible petals, extra virgin olive oil.',
    badge: 'Raw Bar Selection',
    image: '/images/menu%20images/Gemini_Generated_Image_gm5xexgm5xexgm5x.webp',
    tastingNote: 'Bright • Silky • Citrus Floral',
    rating: 4.8,
    reviewCount: 119,
  },
  {
    id: 'duck-terrine',
    name: 'Duck Confit Terrine',
    category: 'dinner',
    price: '$34',
    description: 'Slow-cooked heritage duck leg terrine, pickled cornichons, sour cherry reduction, French fleur de sel.',
    badge: 'Classic Heritage',
    image: '/images/menu%20images/Gemini_Generated_Image_ny1xg2ny1xg2ny1x.webp',
    tastingNote: 'Rich • Tart Cherry • Complex',
    rating: 4.7,
    reviewCount: 84,
  },
  {
    id: 'wagyu-tataki',
    name: 'A5 Miyazaki Wagyu Tataki',
    category: 'dinner',
    price: '$46',
    description: 'Flash-seared Japanese A5 Miyazaki wagyu, crispy garlic chips, shaved red shallots, aged citrus ponzu.',
    badge: 'A5 Grade Japan',
    image: '/images/menu%20images/Gemini_Generated_Image_pinj5wpinj5wpinj.webp',
    tastingNote: 'Melt-in-Mouth • Smoky • Umami',
    rating: 4.9,
    reviewCount: 167,
  },

  // --- DESSERTS ---
  {
    id: 'creme-brulee',
    name: 'Bourbon Vanilla Bean Crème Brûlée',
    category: 'desserts',
    price: '$20',
    description: 'Torched caramelized sugar crust, Madagascar Bourbon vanilla bean custard, wild raspberries & candied walnuts.',
    badge: 'Pâtisserie Selection',
    image: '/images/menu%20images/Gemini_Generated_Image_j4trl7j4trl7j4tr.webp',
    tastingNote: 'Crunchy Caramel • Velvet Custard',
    rating: 4.9,
    reviewCount: 172,
  },

  // --- DRINKS & COCKTAILS ---
  {
    id: 'old-fashioned',
    name: 'Golden Old Fashioned',
    category: 'drinks',
    price: '$28',
    description: 'Small-batch Kentucky bourbon, raw demerara syrup, aromatic bitters, charred orange peel, 24k edible gold leaf.',
    badge: 'Signature Cocktail',
    image: '/images/menu%20images/Gemini_Generated_Image_5ovqr75ovqr75ovq.webp',
    tastingNote: 'Smoky Oak • Caramel • Citrus',
    rating: 4.9,
    reviewCount: 154,
  },
  {
    id: 'espresso-martini',
    name: 'Imperial Espresso Martini',
    category: 'drinks',
    price: '$26',
    description: 'Single-origin Ethiopian espresso, artisan coffee liqueur, Madagascar chocolate shavings, roasted bean skewer.',
    badge: 'Bar Masterpiece',
    image: '/images/menu%20images/Gemini_Generated_Image_93nuky93nuky93nu.webp',
    tastingNote: 'Velvet Crema • Dark Cacao • Bold',
    rating: 4.8,
    reviewCount: 138,
  },
  {
    id: 'passionfruit-royale',
    name: 'Passionfruit Royale Coupe',
    category: 'drinks',
    price: '$28',
    description: 'Crown-garnished champagne coupe, fresh lilikoi puree, botanical dry gin, citrus cloud mist.',
    badge: 'Champagne Cocktail',
    image: '/images/menu%20images/Gemini_Generated_Image_iffy1diffy1diffy.webp',
    tastingNote: 'Sparkling • Tropical • Crisp',
    rating: 4.7,
    reviewCount: 92,
  },
  {
    id: 'whiskey-sour',
    name: 'Smoked Cedar Whiskey Sour',
    category: 'drinks',
    price: '$27',
    description: 'Peated single malt, fresh Meyer lemon juice, silk egg white foam, dehydrated blood orange wheel.',
    badge: 'Smoked Hearth',
    image: '/images/menu%20images/Gemini_Generated_Image_m0gnmym0gnmym0gn.webp',
    tastingNote: 'Bright Citrus • Peat Smoke • Silk',
    rating: 4.8,
    reviewCount: 104,
  },
  {
    id: 'truffle-martini',
    name: 'Black Truffle Essence Martini',
    category: 'drinks',
    price: '$32',
    description: 'Black winter truffle-infused potato vodka, dry French vermouth, dark chocolate bitters, freshly shaved truffle.',
    badge: 'Cellar Exclusive',
    image: '/images/menu%20images/Gemini_Generated_Image_r4nzyqr4nzyqr4nz.webp',
    tastingNote: 'Earth • Cacao • Luxurious Dry',
    rating: 4.8,
    reviewCount: 86,
  },
];

export const CATEGORIES_CONFIG = [
  { key: 'all' as MenuCategory, label: 'ALL CREATIONS', count: ALL_MENU_ITEMS.length },
  { key: 'breakfast' as MenuCategory, label: 'BREAKFAST & BRUNCH', count: ALL_MENU_ITEMS.filter((i) => i.category === 'breakfast').length },
  { key: 'lunch' as MenuCategory, label: 'LUNCH & RAW BAR', count: ALL_MENU_ITEMS.filter((i) => i.category === 'lunch').length },
  { key: 'dinner' as MenuCategory, label: 'DINNER & MAINS', count: ALL_MENU_ITEMS.filter((i) => i.category === 'dinner').length },
  { key: 'desserts' as MenuCategory, label: 'EPICUREAN DESSERTS', count: ALL_MENU_ITEMS.filter((i) => i.category === 'desserts').length },
  { key: 'drinks' as MenuCategory, label: 'ARTISANAL DRINKS', count: ALL_MENU_ITEMS.filter((i) => i.category === 'drinks').length },
];

export const TOP_RATED_ITEMS: MenuItem[] = ALL_MENU_ITEMS.filter((item) => item.featured).slice(0, 3);
