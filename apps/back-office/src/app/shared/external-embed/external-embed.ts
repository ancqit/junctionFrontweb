import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-external-embed',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './external-embed.html',
  styleUrl: './external-embed.scss',
})
export class ExternalEmbedComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /** Full iframe URL (already includes shop context query params). */
  readonly src = input.required<string | null>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly emptyMessage = input<string>('Select or create a shop first.');
  readonly openLabel = input<string>('Open in new tab');

  readonly safeSrc = computed<SafeResourceUrl | null>(() => {
    const url = this.src()?.trim();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  readonly canOpen = computed(() => !!this.src()?.trim());
}
