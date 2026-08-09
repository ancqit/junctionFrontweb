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

/** Roles from junctionBack (`UserRole` / login TokenResponse). */
export type UserRole = 'admin' | 'owner' | 'viewer';

export interface AuthUser {
  id: string;
  email: string | null;
  phone_number: string | null;
  display_name: string;
  role?: UserRole | string | null;
  user_type?: UserRole | string | null;
}

export type PlanType = 'free_trial' | 'starter' | 'growth' | 'premium';
export type PlanStatus = 'active' | 'grace_period' | 'expired' | 'cancelled' | 'deactivated';

export interface PlanSummary {
  type: PlanType;
  status: PlanStatus;
  name: string;
  price_inr: number;
  max_products: number | null;
  profile_only: boolean;
  description: string;
  started_at: string;
  ends_at?: string | null;
  days_remaining?: number | null;
  is_active: boolean;
  trial_used: boolean;
  selected_plan_type?: PlanType | null;
  in_grace_period?: boolean;
  grace_ends_at?: string | null;
}

/** Matches junctionBack TokenResponse (OTP verify / refresh / login). */
export interface RefreshResponse {
  access_token: string;
  token_type: 'bearer';
  user: AuthUser;
  plan?: PlanSummary;
  /** Top-level role from junctionBack; also mirrored on `user.role`. */
  role?: UserRole | string | null;
}

export type OtpVerification = RefreshResponse;

export function normalizeUserRole(
  source?: AuthUser | UserRole | string | null,
  fallbackRole?: UserRole | string | null,
): UserRole {
  const raw = String(
    typeof source === 'string'
      ? source
      : (source?.role ?? source?.user_type ?? fallbackRole ?? 'owner'),
  )
    .trim()
    .toLowerCase();
  if (raw === 'admin') {
    return 'admin';
  }
  if (raw === 'viewer') {
    return 'viewer';
  }
  return 'owner';
}

export function homePathForRole(role: UserRole): string {
  if (role === 'admin') {
    return '/admin';
  }
  if (role === 'viewer') {
    return '/viewer';
  }
  return '/back-office';
}
