export type MarketPrice = {
  bazar: string;
  location?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  averagePrice?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  category: string;
  categorySlug: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  change: number;
  description: string;
  markets: MarketPrice[];
};

export type Category = { name: string; slug: string; emoji: string };
