import { computed, inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { CurrentShopService } from './current-shop.service';
import { PlanSummary } from './models';
import { Shop, ShopsApi } from './shops.api';

export type ShopLockReason = 'manual' | 'plan_expired';

/**
 * Per-shop viewer lock — manual toggle or automatic when the shop plan expires.
 * Locked shops keep read-only / viewer back-office (Plans + Shops stay open).
 */
@Injectable({ providedIn: 'root' })
export class ShopLockService {
  private readonly currentShop = inject(CurrentShopService);
  private readonly shopsApi = inject(ShopsApi);

  /** Active shop is in viewer mode. */
  readonly activeLocked = computed(() => {
    const shop = this.currentShop.shop();
    return shop ? this.isLocked(shop) : false;
  });

  readonly activeLockReason = computed((): ShopLockReason | null => {
    const shop = this.currentShop.shop();
    return shop ? this.lockReason(shop) : null;
  });

  isLocked(shop: Shop): boolean {
    if (this.isPlanExpiredLock(shop)) {
      return true;
    }
    return shop.is_locked === true || this.currentShop.readShopLocked(shop.id);
  }

  isOwnerMode(shop: Shop): boolean {
    return !this.isLocked(shop);
  }

  lockReason(shop: Shop): ShopLockReason | null {
    if (this.isPlanExpiredLock(shop)) {
      return 'plan_expired';
    }
    if (shop.is_locked === true || this.currentShop.readShopLocked(shop.id)) {
      return 'manual';
    }
    return null;
  }

  /** Plan ended after grace — owner cannot unlock until renewal. */
  isPlanExpiredLock(shop: Shop): boolean {
    return isShopPlanPostGraceExpired(shop.plan);
  }

  canManualUnlock(shop: Shop): boolean {
    return !this.isPlanExpiredLock(shop);
  }

  /** Persist viewer lock for a shop (manual owner toggle). */
  setManualLock(shop: Shop, locked: boolean): Observable<Shop> {
    if (locked) {
      return this.persistLock(shop, true, 'manual');
    }
    if (!this.canManualUnlock(shop)) {
      return of(shop);
    }
    return this.persistLock(shop, false, null);
  }

  /**
   * When a shop plan expires, lock it on the server once (idempotent).
   * Safe to call after list/load; no-ops when already locked or plan still active.
   */
  ensurePlanExpiredLock(shop: Shop): Observable<Shop | null> {
    if (!this.isPlanExpiredLock(shop)) {
      return of(null);
    }
    if (shop.is_locked === true && shop.lock_reason === 'plan_expired') {
      this.currentShop.writeShopLocked(shop.id, true);
      return of(null);
    }
    return this.persistLock(shop, true, 'plan_expired').pipe(
      catchError(() => of(null)),
    );
  }

  syncActiveShopPlanLock(): Observable<Shop | null> {
    const shop = this.currentShop.shop();
    if (!shop?.id) {
      return of(null);
    }
    return this.ensurePlanExpiredLock(shop);
  }

  applyLockFromRecord(shop: Shop): Shop {
    const locked = this.isLocked(shop);
    this.currentShop.writeShopLocked(shop.id, locked);
    return { ...shop, is_locked: locked, lock_reason: this.lockReason(shop) };
  }

  private persistLock(
    shop: Shop,
    locked: boolean,
    reason: ShopLockReason | null,
  ): Observable<Shop> {
    const name = shop.name?.trim();
    if (!shop.id || !name) {
      return of(shop);
    }
    this.currentShop.writeShopLocked(shop.id, locked);
    return this.shopsApi.updateLockStatus({ name, is_locked: locked, lock_reason: reason }).pipe(
      tap((updated) => {
        const merged = this.applyLockFromRecord(updated);
        this.currentShop.setShop(merged);
      }),
      catchError((err: unknown) => {
        if (this.isUnprocessable(err)) {
          return this.shopsApi.update(shop.id, { is_locked: locked }).pipe(
            tap((updated) => {
              const merged = this.applyLockFromRecord({
                ...updated,
                lock_reason: reason ?? updated.lock_reason ?? null,
              });
              this.currentShop.setShop(merged);
            }),
          );
        }
        throw err;
      }),
    );
  }

  private isUnprocessable(err: unknown): boolean {
    const status = (err as { status?: number })?.status;
    return status === 404 || status === 405 || status === 422;
  }
}

/** Shop-level plan ended after grace — same rules as account deactivation. */
export function isShopPlanPostGraceExpired(plan: PlanSummary | null | undefined): boolean {
  if (!plan) {
    return false;
  }
  if (plan.in_grace_period || plan.status === 'grace_period') {
    return false;
  }
  return (
    plan.status === 'expired' ||
    plan.status === 'deactivated' ||
    plan.status === 'cancelled' ||
    plan.is_active === false
  );
}
