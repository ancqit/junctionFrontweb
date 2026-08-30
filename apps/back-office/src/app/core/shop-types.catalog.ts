/**
 * Local shop-type options shaped like junctionBack `GET /shops/types`
 * (`ShopTypeInfo`: value, label, category, group?, description).
 * Used as fallback when the API catalog is unavailable.
 */
export type ShopTypeCategory =
  | 'retail'
  | 'food'
  | 'beverage'
  | 'health_and_beauty'
  | 'home_and_living'
  | 'automotive'
  | 'services'
  | 'wholesale'
  | 'agriculture'
  | 'education'
  | 'entertainment'
  | 'other';

export interface ShopTypeInfo {
  value: string;
  label: string;
  category: ShopTypeCategory;
  group?: string | null;
  description: string;
}

/** Compact starter list for the Profile UI when `GET /shops/types` is unavailable. */
export const SHOP_TYPE_OPTIONS: ShopTypeInfo[] = [
  {
    value: 'kirana_grocery',
    label: 'Kirana / Grocery Store',
    category: 'retail',
    group: 'grocery',
    description: 'Neighbourhood grocery, provisions, and daily essentials',
  },
  {
    value: 'mobile_retail',
    label: 'Mobile & Accessories Retail',
    category: 'retail',
    group: 'electronics',
    description: 'Smartphones, tablets, chargers, and mobile accessories',
  },
  {
    value: 'electronics_retail',
    label: 'Electronics Retail',
    category: 'retail',
    group: 'electronics',
    description: 'TVs, audio, cameras, and consumer electronics',
  },
  {
    value: 'clothing_store',
    label: 'Clothing Store',
    category: 'retail',
    group: 'fashion',
    description: 'Apparel for men, women, or children',
  },
  {
    value: 'pharmacy',
    label: 'Pharmacy / Medical Store',
    category: 'health_and_beauty',
    group: 'health',
    description: 'Medicines, OTC health products, and wellness items',
  },
  {
    value: 'restaurant',
    label: 'Restaurant',
    category: 'food',
    group: 'dining',
    description: 'Dine-in or takeaway food service',
  },
  {
    value: 'cafe',
    label: 'Café / Coffee Shop',
    category: 'food',
    group: 'dining',
    description: 'Coffee, tea, snacks, and light meals',
  },
  {
    value: 'bakery',
    label: 'Bakery / Confectionery',
    category: 'food',
    group: 'fresh',
    description: 'Bread, cakes, pastries, and baked goods',
  },
  {
    value: 'salon',
    label: 'Salon / Beauty Parlour',
    category: 'health_and_beauty',
    group: 'beauty',
    description: 'Hair, skin, and beauty services',
  },
  {
    value: 'hardware_store',
    label: 'Hardware Store',
    category: 'retail',
    group: 'home',
    description: 'Tools, fasteners, paints, and building supplies',
  },
  {
    value: 'mobile_repair',
    label: 'Mobile & Electronics Repair Shop',
    category: 'services',
    group: 'technician',
    description: 'Phone, tablet, and gadget repair storefront',
  },
  {
    value: 'other',
    label: 'Other',
    category: 'other',
    group: null,
    description: 'Business type not listed above',
  },
];

export function shopTypeLabel(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return SHOP_TYPE_OPTIONS.find((row) => row.value === value)?.label ?? value;
}
