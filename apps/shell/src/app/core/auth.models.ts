export interface OtpRequest {
  name: string;
  mobileNumber: string;
  city: string;
  locality: string;
}

export interface OtpChallenge { challengeId: string; expiresInSeconds: number; }
export interface AuthTokens { accessToken: string; refreshToken: string; expiresInSeconds: number; }
export interface OtpVerification extends AuthTokens {
  user: { id: string; name: string; mobileNumber: string; city: string; locality: string };
}
