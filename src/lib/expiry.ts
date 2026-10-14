

export const PUBLIC_GRACE_DAYS = 7;
export const MANAGE_GRACE_DAYS = 30;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Public link expiry: event date + PUBLIC_GRACE_DAYS. */
export function expiresAt(eventDate: Date): Date {
  return new Date(eventDate.getTime() + PUBLIC_GRACE_DAYS * MS_PER_DAY);
}


export function manageReadableUntil(eventDate: Date): Date {
  return new Date(
    eventDate.getTime() + (PUBLIC_GRACE_DAYS + MANAGE_GRACE_DAYS) * MS_PER_DAY
  );
}


export function isExpired(eventDate: Date, now: Date = new Date()): boolean {
  return now.getTime() > expiresAt(eventDate).getTime();
}


export function isManageExpired(
  eventDate: Date,
  now: Date = new Date()
): boolean {
  return now.getTime() > manageReadableUntil(eventDate).getTime();
}


export function computeExpiry(eventDate: Date) {
  const publicExpiry = expiresAt(eventDate);
  const manageExpiry = manageReadableUntil(eventDate);
  return {
    publicExpiry,
    manageExpiry,
  };
}