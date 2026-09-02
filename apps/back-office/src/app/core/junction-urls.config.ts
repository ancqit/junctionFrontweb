import { Shop } from './shops.api';

/** Public junction.today origin (local dev may run jtoday on another port). */
export function resolveJunctionTodayBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://junction.today';
  }
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  return isLocal ? 'http://localhost:4202' : 'https://junction.today';
}

/** Public junction.blog origin (local dev may run junctionBlog on another port). */
export function resolveJunctionBlogBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://junction.blog';
  }
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  return isLocal ? 'http://localhost:4203' : 'https://junction.blog';
}

type ShopLink = Pick<Shop, 'id' | 'city' | 'locality' | 'name'>;

/** Owner preview of their shop on junction.today (embedded back-office view). */
export function buildJunctionTodayShopUrl(shop: ShopLink): string {
  const base = resolveJunctionTodayBaseUrl();
  const params = new URLSearchParams({
    embed: '1',
    store_id: shop.id.trim(),
    city: shop.city.trim(),
    locality: shop.locality.trim(),
    marketplace: '1',
  });
  const name = shop.name?.trim();
  if (name) {
    params.set('shop', name);
  }
  return `${base}/?${params}`;
}

/** Shop-scoped complaints / blog console on junction.blog. */
export function buildJunctionBlogShopUrl(shop: ShopLink): string {
  const base = resolveJunctionBlogBaseUrl();
  const city = shop.city.trim();
  const locality = shop.locality.trim();
  const params = new URLSearchParams({
    embed: '1',
    store_id: shop.id.trim(),
    junction: `${locality}, ${city}`,
  });
  const name = shop.name?.trim();
  if (name) {
    params.set('shop', name);
  }
  return `${base}/?${params}`;
}
