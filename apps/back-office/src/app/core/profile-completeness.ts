/**
 * Profile completeness checklist used by the back-office sidebar modal.
 * Maps to junctionBack APIs:
 * - GET/PATCH /profile (display_name, bio, avatar_url, phone, email)
 * - GET /auth/digilocker/connect (+ callback sets digilocker_verified)
 * - GET/POST/PUT /shops (name, city, locality)
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
      label: 'Display name',
      detail: 'Shown on your Junction account',
      done: !!input.displayName?.trim(),
      api: 'GET/PATCH /profile',
    },
    {
      id: 'phone',
      label: 'Mobile verified',
      detail: 'Verified by OTP at login',
      done: !!input.phoneNumber?.trim(),
      api: 'POST /auth/otp/verify → profile.phone_number',
    },
    {
      id: 'bio',
      label: 'Bio',
      detail: 'Short description of you or your shop',
      done: !!input.bio?.trim(),
      api: 'PATCH /profile { bio }',
    },
    {
      id: 'avatar',
      label: 'Avatar',
      detail: 'Profile photo URL',
      done: !!input.avatarUrl?.trim(),
      api: 'PATCH /profile { avatar_url }',
    },
    {
      id: 'digilocker',
      label: 'DigiLocker identity',
      detail: 'Government ID verification via DigiLocker',
      done: !!input.digilockerVerified,
      api: 'GET /auth/digilocker/connect',
    },
    {
      id: 'shop',
      label: 'Shop location',
      detail: 'Shop name, city, and locality',
      done: shopDone,
      api: 'POST/PUT /shops',
    },
  ];

  const doneCount = items.filter((item) => item.done).length;
  const total = items.length;
  const percent = Math.round((doneCount / total) * 100);

  return { percent, doneCount, total, items };
}
