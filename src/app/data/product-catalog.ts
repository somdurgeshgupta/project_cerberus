export interface ProductCatalogItem {
  id: string;
  name: string;
  category: string;
  price: string;
  tag: string;
  tone: 'sun' | 'sky' | 'clay' | 'forest';
  shortDescription: string;
  longDescription: string;
  material: string;
}

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  {
    id: 'halo-carry-bag',
    name: 'Halo Carry Bag',
    category: 'Accessories',
    price: '$124',
    tag: 'Best Seller',
    tone: 'sun',
    shortDescription: 'A structured daily bag designed for clean styling and practical carry.',
    longDescription: 'The Halo Carry Bag blends soft architectural lines with a warm neutral finish, giving everyday outfits a polished anchor that still feels effortless.',
    material: 'Italian vegan leather'
  },
  {
    id: 'arc-lounge-chair',
    name: 'Arc Lounge Chair',
    category: 'Home',
    price: '$289',
    tag: 'New Season',
    tone: 'sky',
    shortDescription: 'A sculpted accent chair that softens a room without losing presence.',
    longDescription: 'Arc Lounge Chair was chosen for shoppers who want one hero furniture piece with enough comfort for daily use and enough shape to define the room.',
    material: 'Powder-coated steel and boucle'
  },
  {
    id: 'pulse-runner',
    name: 'Pulse Runner',
    category: 'Footwear',
    price: '$98',
    tag: 'Editor Pick',
    tone: 'clay',
    shortDescription: 'A lightweight trainer for movement-heavy days and minimal wardrobes.',
    longDescription: 'Pulse Runner balances comfort, grip, and understated detail so it works as both an active shoe and a casual daily rotation staple.',
    material: 'Mesh knit and recycled foam'
  },
  {
    id: 'solstice-lamp',
    name: 'Solstice Lamp',
    category: 'Lighting',
    price: '$146',
    tag: 'Trending',
    tone: 'forest',
    shortDescription: 'Ambient table lighting with a soft glow and compact footprint.',
    longDescription: 'Solstice Lamp brings a warm editorial mood to bedside tables, shelving, and reading corners while staying versatile enough for different interior styles.',
    material: 'Brushed metal and opal glass'
  }
];
