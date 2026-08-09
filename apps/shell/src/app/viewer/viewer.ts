import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { SessionService } from '../core/session.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class ViewerPage {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);

  readonly displayName = this.session.user?.display_name ?? 'there';

  logout(): void {
    this.auth.logout();
  }
}
