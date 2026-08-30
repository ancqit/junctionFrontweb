/**
 * Profile completeness checklist used by the back-office sidebar modal.
 * Maps to junctionBack APIs:
 * - GET/PATCH /profile (display_name, bio, avatar_url, phone, email)
 * - GET /auth/digilocker/connect (+ callback sets digilocker_verified)
 * - GET/POST/PUT /shops (name, city, locality)
 *
 * label/detail are i18n keys (see translations.ts profileModal.check.*).
 */

export type ProfileCheckId =
  | 'display_name'
  | 'phone'
  | 'bio'
  | 'avatar'
  | 'digilocker'
  | 'shop';

export interface ProfileCheckItem {
  id: ProfileCheckId;
  label: string;
  detail: string;
  done: boolean;
  api: string;
}

export interface ProfileCompleteness {
  percent: number;
  doneCount: number;
  total: number;
  items: ProfileCheckItem[];
}

export function buildProfileCompleteness(input: {
  displayName?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  digilockerVerified?: boolean | null;
  shopName?: string | null;
  shopCity?: string | null;
  shopLocality?: string | null;
}): ProfileCompleteness {
  const shopDone = !!(
    input.shopName?.trim() &&
    input.shopCity?.trim() &&
    input.shopLocality?.trim()
  );

  const items: ProfileCheckItem[] = [
    {
      id: 'display_name',
      label: 'profileModal.check.display_name.label',
      detail: 'profileModal.check.display_name.detail',
      done: !!input.displayName?.trim(),
      api: 'GET/PATCH /profile',
    },
    {
      id: 'phone',
      label: 'profileModal.check.phone.label',
      detail: 'profileModal.check.phone.detail',
      done: !!input.phoneNumber?.trim(),
      api: 'POST /auth/otp/verify → profile.phone_number',
    },
    {
      id: 'bio',
      label: 'profileModal.check.bio.label',
      detail: 'profileModal.check.bio.detail',
      done: !!input.bio?.trim(),
      api: 'PATCH /profile { bio }',
    },
    {
      id: 'avatar',
      label: 'profileModal.check.avatar.label',
      detail: 'profileModal.check.avatar.detail',
      done: !!input.avatarUrl?.trim(),
      api: 'PATCH /profile { avatar_url }',
    },
    {
      id: 'digilocker',
      label: 'profileModal.check.digilocker.label',
      detail: 'profileModal.check.digilocker.detail',
      done: !!input.digilockerVerified,
      api: 'GET /auth/digilocker/connect',
    },
    {
      id: 'shop',
      label: 'profileModal.check.shop.label',
      detail: 'profileModal.check.shop.detail',
      done: shopDone,
      api: 'POST/PUT /shops',
    },
  ];

  const doneCount = items.filter((item) => item.done).length;
  const total = items.length;
  const percent = Math.round((doneCount / total) * 100);

  return { percent, doneCount, total, items };
}
