export interface OtpRequest {
  display_name: string;
  phone_number: string;
  recaptcha_token: string;
}

export interface OtpChallenge { challengeId: string; session_info: string; expiresInSeconds: number; }
export interface AuthTokens { accessToken: string; refreshToken: string; expiresInSeconds: number; }

export interface AuthUser {
  id: string;
  email: string | null;
  phone_number: string;
  display_name: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: 'bearer';
  user: AuthUser;
}

export type OtpVerification = RefreshResponse;
