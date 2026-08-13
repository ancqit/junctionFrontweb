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

  /** Upload shop photo from device — `POST /profile/avatar` (multipart). */
  uploadAvatar(file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.postFormData<UserProfile>('/profile/avatar', formData);
  }

  /** Start DigiLocker OAuth — `GET /auth/digilocker/connect`. */
  connectDigiLocker(): Observable<DigiLockerConnectResponse | null> {
    return this.api.get<DigiLockerConnectResponse>('/auth/digilocker/connect').pipe(
      catchError(() => of(null)),
    );
  }
}
