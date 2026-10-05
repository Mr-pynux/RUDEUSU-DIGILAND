const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomBlock(len = 4): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return out;
}

/**
 * Generates a unique activation code shaped like PREFIX-XXXX-XXXX-XXXX.
 * The prefix derives from the product (GEM, GPT, IPTV, WIN11, ...).
 */
export function generateCode(prefix: string): string {
  const clean = prefix.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 6) || "DIGI";
  return `${clean}-${randomBlock(4)}-${randomBlock(4)}-${randomBlock(4)}`;
}

export function generateOrderShortId(): string {
  return `RD-${randomBlock(4)}-${randomBlock(4)}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Service fee: 5% of subtotal + $0.30 processing, rounded to 2 decimals. */
export function computeServiceFee(subtotal: number): number {
  return Math.round((subtotal * 0.05 + 0.3) * 100) / 100;
}
