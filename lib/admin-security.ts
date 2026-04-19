/**
 * Admin Security Utilities
 * Handles password hashing and validation for the secret Admin Panel.
 */

export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Current Admin Credentials
export const ADMIN_USERNAME = "NOVAAAPSADMIN";
// Hash for "admin1312mk._$"
export const ADMIN_HASH = "9ec903d6f76c5354992565650117a5867b66df21e7d96924c6194451010372df";

const LOCKOUT_KEY = 'admin_lockout_until';
const ATTEMPTS_KEY = 'admin_attempts';

export function checkLockout(): { locked: boolean; remaining: number } {
  const until = localStorage.getItem(LOCKOUT_KEY);
  if (!until) return { locked: false, remaining: 0 };
  
  const now = Date.now();
  const lockoutTime = parseInt(until);
  
  if (now < lockoutTime) {
    return { locked: true, remaining: Math.ceil((lockoutTime - now) / 1000) };
  }
  
  localStorage.removeItem(LOCKOUT_KEY);
  return { locked: false, remaining: 0 };
}

export function recordAttempt(success: boolean) {
  if (success) {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
    return;
  }
  
  const currentAttempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
  localStorage.setItem(ATTEMPTS_KEY, currentAttempts.toString());
  
  if (currentAttempts >= 3) {
    const lockoutUntil = Date.now() + 30000; // 30 seconds
    localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
    localStorage.setItem(ATTEMPTS_KEY, '0');
  }
}
