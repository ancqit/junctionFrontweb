import { FREE_TRIAL_DAYS, PAID_PLAN_DAYS, PlanSummary, PlanType } from './models';

export interface PlanCountdown {
  planType: PlanType;
  planName: string;
  daysRemaining: number | null;
  totalDays: number;
  isActive: boolean;
  isExpired: boolean;
  isTrial: boolean;
  isYearly: boolean;
  endsAt: string | null;
  message: string;
}

function daysUntil(endsAt: Date, now = new Date()): number {
  const ms = endsAt.getTime() - now.getTime();
  if (ms <= 0) {
    return 0;
  }
  return Math.ceil(ms / 86_400_000);
}

function addDays(start: Date, days: number): Date {
  const end = new Date(start.getTime());
  end.setUTCDate(end.getUTCDate() + days);
  return end;
}

/**
 * Builds the overview countdown from junctionBack PlanSummary.
 * Free trial uses the 15-day backend counter.
 * Paid plans are treated as yearly (365 days from started_at) when ends_at is absent.
 */
export function buildPlanCountdown(plan: PlanSummary, now = new Date()): PlanCountdown {
  const isTrial = plan.type === 'free_trial';
  const isYearly = !isTrial;
  const totalDays = isTrial ? FREE_TRIAL_DAYS : PAID_PLAN_DAYS;

  let endsAt: Date | null = plan.ends_at ? new Date(plan.ends_at) : null;
  if (!endsAt && isYearly && plan.started_at) {
    endsAt = addDays(new Date(plan.started_at), PAID_PLAN_DAYS);
  }

  let daysRemaining = plan.days_remaining ?? null;
  if (daysRemaining == null && endsAt) {
    daysRemaining = daysUntil(endsAt, now);
  }

  const isExpired = plan.status === 'expired' || (daysRemaining != null && daysRemaining <= 0 && !plan.is_active);
  const isActive = plan.is_active && !isExpired;

  let message: string;
  if (isTrial && isActive) {
    message = `Hello — these are the days remaining for your free trial: ${daysRemaining ?? 0}.`;
  } else if (isTrial && isExpired) {
    message = 'Your free trial has ended. Choose Starter, Growth, or Premium to continue.';
  } else if (isActive && isYearly) {
    message = `You are on ${plan.name}. Time remaining on your yearly plan: ${daysRemaining ?? 0} day${(daysRemaining ?? 0) === 1 ? '' : 's'}.`;
  } else if (isExpired) {
    message = `Your ${plan.name} plan period has ended. Renew or choose another plan.`;
  } else {
    message = `Hello — your current plan is ${plan.name}.`;
  }

  return {
    planType: plan.type,
    planName: plan.name,
    daysRemaining,
    totalDays,
    isActive,
    isExpired,
    isTrial,
    isYearly,
    endsAt: endsAt ? endsAt.toISOString() : null,
    message,
  };
}
