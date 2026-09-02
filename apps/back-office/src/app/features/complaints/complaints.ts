import { Component, computed, inject, OnInit } from '@angular/core';
import { CurrentShopService } from '../../core/current-shop.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { buildJunctionBlogShopUrl } from '../../core/junction-urls.config';
import { ExternalEmbedComponent } from '../../shared/external-embed/external-embed';

@Component({
  selector: 'app-complaints',
  imports: [ExternalEmbedComponent, TranslatePipe],
  templateUrl: './complaints.html',
  styleUrl: './complaints.scss',
})
export class ComplaintsPage implements OnInit {
  private readonly currentShop = inject(CurrentShopService);

  readonly embedUrl = computed(() => {
    const shop = this.currentShop.shop();
    if (!shop?.id?.trim() || !shop.city?.trim() || !shop.locality?.trim()) {
      return null;
    }
    return buildJunctionBlogShopUrl(shop);
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
