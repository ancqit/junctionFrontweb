import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { UserProfile } from './models';

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private readonly api = inject(BackOfficeApiService);

  me(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/profile');
  }
}
