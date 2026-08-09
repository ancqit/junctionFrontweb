import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { ProfileUpdate, UserProfile } from './models';

export interface DigiLockerConnectResponse {
  authorization_url: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private readonly api = inject(BackOfficeApiService);

  me(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/profile');
  }

  update(payload: ProfileUpdate): Observable<UserProfile> {
    return this.api.patch<UserProfile>('/profile', payload);
  }

  /** Start DigiLocker OAuth — `GET /auth/digilocker/connect`. */
  connectDigiLocker(): Observable<DigiLockerConnectResponse | null> {
    return this.api.get<DigiLockerConnectResponse>('/auth/digilocker/connect').pipe(
      catchError(() => of(null)),
    );
  }
}
