import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { PlanAccessService } from '../../core/plan-access.service';
import { CurrentShopService } from '../../core/current-shop.service';
import { ShopLockService } from '../../core/shop-lock.service';

@Component({
  selector: 'app-activate',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './activate.html',
  styleUrl: './activate.scss',
})
export class ActivatePage implements OnInit {
  private readonly access = inject(PlanAccessService);
  private readonly shopLock = inject(ShopLockService);
  private readonly currentShop = inject(CurrentShopService);
  private readonly route = inject(ActivatedRoute);

  readonly plan = this.access.plan;
  readonly loading = this.access.loading;
  readonly isViewer = this.access.isViewer;
  readonly shop = this.currentShop.shop;

  private readonly scope = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('scope') ?? 'account')),
    { initialValue: 'account' },
  );

  readonly isShopScope = computed(() => {
    if (this.scope() === 'shop') {
      return true;
    }
    return !this.access.locked() && this.shopLock.activeLocked();
  });

  readonly lockReason = computed(() => this.shopLock.activeLockReason());

  ngOnInit(): void {
    this.access.refresh().subscribe();
    this.currentShop.ensureShop().subscribe({
      next: (shop) => {
        if (shop) {
          this.shopLock.syncActiveShopPlanLock().subscribe();
        }
      },
    });
  }
}
