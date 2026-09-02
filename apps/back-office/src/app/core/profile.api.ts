import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { BackOfficeApiService } from './api.service';
import { ProfileUpdate, UserProfile } from './models';

export interface DigiLockerConnectResponse {
  authorization_url: string;
}

export interface GstCaptchaResponse {
  session_id: string;
  image: string;
}

export interface GstVerifyResponse {
  gstin: string;
  gst_verified: boolean;
  legal_name?: string | null;
  trade_name?: string | null;
  status?: string | null;
  taxpayer_type?: string | null;
  message: string;
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

  /** Free GST portal captcha — `GET /gst/captcha`. */
  gstCaptcha(): Observable<GstCaptchaResponse> {
    return this.api.get<GstCaptchaResponse>('/gst/captcha');
  }

  /** Verify GSTIN with captcha — `POST /gst/verify`. */
  verifyGst(payload: {
    session_id: string;
    gstin: string;
    captcha: string;
  }): Observable<GstVerifyResponse> {
    return this.api.post<GstVerifyResponse>('/gst/verify', payload);
  }
}
