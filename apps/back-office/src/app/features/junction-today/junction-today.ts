import { Component, computed, inject, OnInit } from '@angular/core';
import { CurrentShopService } from '../../core/current-shop.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { buildJunctionTodayShopUrl } from '../../core/junction-urls.config';
import { ExternalEmbedComponent } from '../../shared/external-embed/external-embed';

@Component({
  selector: 'app-junction-today',
  imports: [ExternalEmbedComponent, TranslatePipe],
  templateUrl: './junction-today.html',
  styleUrl: './junction-today.scss',
})
export class JunctionTodayPage implements OnInit {
  private readonly currentShop = inject(CurrentShopService);

  readonly embedUrl = computed(() => {
    const shop = this.currentShop.shop();
    if (!shop?.id?.trim() || !shop.city?.trim() || !shop.locality?.trim()) {
      return null;
    }
    return buildJunctionTodayShopUrl(shop);
  });

  readonly embedSubtitle = computed(() => {
    const shop = this.currentShop.shop();
    if (!shop?.name?.trim()) {
      return '';
    }
    return `${shop.name} · ${shop.locality}, ${shop.city}`;
  });

  ngOnInit(): void {
    this.currentShop.ensureShop().subscribe();
  }
}
