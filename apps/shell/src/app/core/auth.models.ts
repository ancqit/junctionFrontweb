export interface OtpRequest {
  display_name: string;
  phone_number: string;
  recaptcha_token: string;
}

export interface OtpChallenge {
  message: string;
  expires_in_seconds: number;
  session_info: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface AuthUser {
  id: string;
  email: string | null;
  phone_number: string | null;
  display_name: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: 'bearer';
  user: AuthUser;
}

export type OtpVerification = RefreshResponse;
