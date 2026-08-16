export interface OtpRequest {
  display_name: string;
  phone_number: string;
  /** Web flow — invisible reCAPTCHA token. */
  recaptcha_token?: string;
  /** Android APK flow — Play Integrity token (nonce = SHA-256 of E.164 phone). */
  play_integrity_token?: string;
  /** Hint for junctionBack: `web` | `android`. */
  client_type?: 'web' | 'android';
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
  /**
   * Prefer this when set (TokenResponse.role from junctionBack).
   * Explicit top-level role wins over a stale `user.role`.
   */
  explicitRole?: UserRole | string | null,
): UserRole {
  const fromExplicit =
    explicitRole != null && String(explicitRole).trim() !== ''
      ? String(explicitRole).trim().toLowerCase()
      : '';
  const fromSource =
    typeof source === 'string'
      ? source.trim().toLowerCase()
      : String(source?.role ?? source?.user_type ?? '')
          .trim()
          .toLowerCase();
  const raw = fromExplicit || fromSource || 'owner';
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
    // Post-grace deactivated view inside the app (not an owner).
    return '/back-office/activate';
  }
  return '/back-office';
}

/** Platform admin plan from junctionBack `admin_plan_summary()`. */
export function isAdminPlan(plan?: PlanSummary | null): boolean {
  if (!plan) {
    return false;
  }
  if (plan.name === 'Admin') {
    return true;
  }
  return (plan.description ?? '').toLowerCase().includes('administrator');
}

/** True when Premium/trial ended and grace is over — user should be treated as a viewer. */
export function isPostGraceViewerPlan(plan?: PlanSummary | null): boolean {
  if (!plan || isAdminPlan(plan)) {
    return false;
  }
  if (plan.in_grace_period || plan.status === 'grace_period') {
    return false;
  }
  return (
    plan.status === 'expired' ||
    plan.status === 'deactivated' ||
    plan.status === 'cancelled' ||
    plan.is_active === false
  );
}

/** Prefer TokenResponse.role; admins are never remapped to viewer. */
export function resolveLoginRole(
  user?: AuthUser | null,
  explicitRole?: UserRole | string | null,
  plan?: PlanSummary | null,
): UserRole {
  const role = normalizeUserRole(user ?? null, explicitRole);
  if (role === 'admin' || isAdminPlan(plan)) {
    return 'admin';
  }
  if (role === 'viewer' || isPostGraceViewerPlan(plan)) {
    return 'viewer';
  }
  return 'owner';
}
