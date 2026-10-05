/**
 * Admin authentication — simple shared-secret scheme appropriate for
 * this owner-controlled demo marketplace.
 *
 * Login:  POST /api/admin/login { password }  -> { ok, token }
 * Verify: admin API routes check the `x-admin-key` header.
 */

export const ADMIN_PASSWORD = "rudeusu2026";
export const ADMIN_TOKEN = "rudeusu-admin-ok-2026";

export function isAdminRequest(req: Request): boolean {
  const key = req.headers.get("x-admin-key") ?? "";
  return key === ADMIN_TOKEN;
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: "Admin authentication required." }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
