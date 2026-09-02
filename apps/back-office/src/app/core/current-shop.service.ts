import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { ProfileApi } from './profile.api';
import { Shop, ShopsApi } from './shops.api';

const SHOP_TYPE_STORAGE_KEY = 'junction.shopTypeById';
const SHOP_PLACE_STORAGE_KEY = 'junction.shopPlaceById';
const SHOP_PHONE_VISIBLE_KEY = 'junction.phoneVisibleById';
const SHOP_LOCKED_KEY = 'junction.shopLockedById';
const ACTIVE_SHOP_STORAGE_KEY = 'junction.activeShopId';
const SESSION_KEY = 'junction.session';

export interface ShopPlaceOverlay {
  city: string;
  locality: string;
}

export interface ShopOwnerContext {
  userId: string | null;
  phoneNumber: string | null;
}

/**
 * Active shop (= project) for the logged-in phone/user.
 *
 * - One mobile number can own many shops.
 * - Back-office work is scoped to the selected active shop (`store_id`).
 * - Admins see all shops on platform APIs; for back-office we prefer shops
 *   owned by their own user id / phone so they can manage their own shop.
 */
@Injectable({ providedIn: 'root' })
export class CurrentShopService {
  private readonly shopsApi = inject(ShopsApi);
  private readonly profileApi = inject(ProfileApi);
  private load$?: Observable<Shop | null>;
  private list$?: Observable<Shop[]>;

  readonly shop = signal<Shop | null>(null);
  readonly storeId = signal<string | null>(null);
  readonly shops = signal<Shop[]>([]);
  readonly owner = signal<ShopOwnerContext>({ userId: null, phoneNumber: null });

  /** Shops owned by the current phone/user (admin-safe). */
  listMine(): Observable<Shop[]> {
    if (!this.list$) {
      this.list$ = this.profileApi.me().pipe(
        catchError(() => of(null)),
        switchMap((profile) => {
          const sessionOwner = this.readSessionOwner();
          const userId = profile?.id?.trim() || sessionOwner.userId;
          const phoneNumber = profile?.phone_number?.trim() || sessionOwner.phoneNumber;
          const isAdmin = this.readSessionRole() === 'admin';
          this.owner.set({ userId, phoneNumber });
          return this.shopsApi.list().pipe(
            map((rows) => this.filterOwnedShops(rows, userId, phoneNumber, isAdmin)),
          );
        }),
        tap((rows) => this.shops.set(rows)),
        shareReplay(1),
      );
    }
    return this.list$;
  }

  /** Load (or reuse) the active shop. */
  ensureShop(): Observable<Shop | null> {
    if (!this.load$) {
      this.load$ = this.listMine().pipe(
        map((shops) => this.resolveActiveShop(shops)),
        tap((shop) => this.applyActive(shop)),
        shareReplay(1),
      );
    }
    return this.load$;
  }

  /** Force refresh after create/update/delete/select. */
  refresh(): Observable<Shop | null> {
    this.list$ = undefined;
    this.load$ = undefined;
    return this.ensureShop();
  }

  /** Choose which shop is active (project switcher). */
  selectShop(shopId: string): Observable<Shop | null> {
    const id = shopId.trim();
    if (!id) {
      return of(this.shop());
    }
    this.writeActiveShopId(id);
    this.list$ = undefined;
    this.load$ = undefined;
    return this.listMine().pipe(
      map((shops) => {
        const match = shops.find((row) => row.id === id) ?? null;
        const shop = this.applyPlaceOverlay(match);
        this.applyActive(shop);
        this.load$ = of(shop).pipe(shareReplay(1));
        return shop;
      }),
    );
  }

  setShop(shop: Shop | null): void {
    const merged = this.applyPlaceOverlay(shop);
    if (merged?.id) {
      this.writeActiveShopId(merged.id);
    }
    this.applyActive(merged);
    this.list$ = undefined;
    this.load$ = of(merged).pipe(shareReplay(1));
    if (merged) {
      this.shops.update((rows) => {
        const others = rows.filter((row) => row.id !== merged.id);
        return [merged, ...others];
      });
    }
  }

  /** Remove local overlays after a shop is deleted on the server. */
  clearShopOverlays(shopId: string): void {
    const id = shopId.trim();
    if (!id) {
      return;
    }
    this.removeStorageEntry(SHOP_TYPE_STORAGE_KEY, id);
    this.removeStorageEntry(SHOP_PLACE_STORAGE_KEY, id);
    this.removeStorageEntry(SHOP_PHONE_VISIBLE_KEY, id);
    this.removeStorageEntry(SHOP_LOCKED_KEY, id);
  }

  /**
   * Admins receive every shop from junctionBack; keep only shops they own.
   * Owners already get an owner-scoped list — do not filter again.
   */
  filterOwnedShops(
    shops: Shop[],
    userId: string | null,
    phoneNumber: string | null,
    isAdmin: boolean,
  ): Shop[] {
    if (!isAdmin) {
      return shops;
    }
    if (!userId && !phoneNumber) {
      return [];
    }
    const normalizedPhone = this.normalizePhone(phoneNumber);
    return shops.filter((shop) => {
      if (userId && shop.owner_user_id === userId) {
        return true;
      }
      if (normalizedPhone && this.normalizePhone(shop.phone_number) === normalizedPhone) {
        return true;
      }
      return false;
    });
  }

  resolveActiveShop(shops: Shop[]): Shop | null {
    if (shops.length === 0) {
      return null;
    }
    const savedId = this.readActiveShopId();
    if (savedId) {
      const saved = shops.find((row) => row.id === savedId);
      if (saved) {
        return this.applyPlaceOverlay(saved);
      }
    }
    // Prefer an open shop as the default “active project”.
    const open = shops.find((row) => row.is_open !== false);
    return this.applyPlaceOverlay(open ?? shops[0]);
  }

  applyPlaceOverlay(shop: Shop | null): Shop | null {
    if (!shop?.id) {
      return shop;
    }
    const place = this.readShopPlace(shop.id);
    if (!place) {
      return shop;
    }
    return {
      ...shop,
      city: shop.city?.trim() || place.city,
      locality: shop.locality?.trim() || place.locality,
    };
  }

  readShopType(shopId: string | null | undefined): string | null {
    if (!shopId) {
      return null;
    }
    try {
      const raw = localStorage.getItem(SHOP_TYPE_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const map = JSON.parse(raw) as Record<string, string>;
      return map[shopId]?.trim() || null;
    } catch {
      return null;
    }
  }

  writeShopType(shopId: string, shopType: string): void {
    try {
      const raw = localStorage.getItem(SHOP_TYPE_STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      map[shopId] = shopType.trim();
      localStorage.setItem(SHOP_TYPE_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  readShopPlace(shopId: string | null | undefined): ShopPlaceOverlay | null {
    if (!shopId) {
      return null;
    }
    try {
      const raw = localStorage.getItem(SHOP_PLACE_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const map = JSON.parse(raw) as Record<string, ShopPlaceOverlay>;
      const row = map[shopId];
      const city = row?.city?.trim() ?? '';
      const locality = row?.locality?.trim() ?? '';
      if (!city || !locality) {
        return null;
      }
      return { city, locality };
    } catch {
      return null;
    }
  }

  writeShopPlace(shopId: string, place: ShopPlaceOverlay): void {
    try {
      const raw = localStorage.getItem(SHOP_PLACE_STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, ShopPlaceOverlay>) : {};
      map[shopId] = {
        city: place.city.trim(),
        locality: place.locality.trim(),
      };
      localStorage.setItem(SHOP_PLACE_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  /** Whether the owner chose to show shop mobile on session catalog (`show_phone` query). */
  readPhoneVisible(shopId: string | null | undefined): boolean {
    if (!shopId) {
      return false;
    }
    try {
      const raw = localStorage.getItem(SHOP_PHONE_VISIBLE_KEY);
      if (!raw) {
        return false;
      }
      const map = JSON.parse(raw) as Record<string, boolean>;
      const value = map[shopId];
      return value === true;
    } catch {
      return false;
    }
  }

  writePhoneVisible(shopId: string, visible: boolean): void {
    try {
      const raw = localStorage.getItem(SHOP_PHONE_VISIBLE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      map[shopId] = visible;
      localStorage.setItem(SHOP_PHONE_VISIBLE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  /** Viewer lock overlay until junctionBack `is_locked` is deployed. */
  readShopLocked(shopId: string | null | undefined): boolean {
    if (!shopId) {
      return false;
    }
    try {
      const raw = localStorage.getItem(SHOP_LOCKED_KEY);
      if (!raw) {
        return false;
      }
      const map = JSON.parse(raw) as Record<string, boolean>;
      return map[shopId] === true;
    } catch {
      return false;
    }
  }

  writeShopLocked(shopId: string, locked: boolean): void {
    try {
      const raw = localStorage.getItem(SHOP_LOCKED_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      map[shopId] = locked;
      localStorage.setItem(SHOP_LOCKED_KEY, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  readActiveShopId(): string | null {
    try {
      return localStorage.getItem(ACTIVE_SHOP_STORAGE_KEY)?.trim() || null;
    } catch {
      return null;
    }
  }

  writeActiveShopId(shopId: string): void {
    try {
      localStorage.setItem(ACTIVE_SHOP_STORAGE_KEY, shopId.trim());
    } catch {
      // ignore
    }
  }

  clearActiveShopId(): void {
    try {
      localStorage.removeItem(ACTIVE_SHOP_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private readSessionOwner(): ShopOwnerContext {
    try {
      const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as {
        user?: { id?: string; phone_number?: string | null };
      } | null;
      const user = parsed?.user;
      return {
        userId: user?.id?.trim() || null,
        phoneNumber: user?.phone_number?.trim() || null,
      };
    } catch {
      return { userId: null, phoneNumber: null };
    }
  }

  private readSessionRole(): string | null {
    try {
      const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as {
        role?: string;
      } | null;
      return parsed?.role?.trim().toLowerCase() || null;
    } catch {
      return null;
    }
  }

  private normalizePhone(phone: string | null | undefined): string {
    const digits = (phone ?? '').replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : digits;
  }

  private removeStorageEntry(key: string, shopId: string): void {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return;
      }
      const map = JSON.parse(raw) as Record<string, unknown>;
      if (!(shopId in map)) {
        return;
      }
      delete map[shopId];
      localStorage.setItem(key, JSON.stringify(map));
    } catch {
      // ignore storage failures
    }
  }

  private applyActive(shop: Shop | null): void {
    this.shop.set(shop);
    this.storeId.set(shop?.id ?? null);
    if (shop?.id) {
      this.writeActiveShopId(shop.id);
    }
  }
}
