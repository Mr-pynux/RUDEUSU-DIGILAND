import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import type { DeliveredItem } from "@/lib/types";

function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

/**
 * Gmail delivery — after payment the buyer's keys / Gmail accounts are
 * emailed to the address used at checkout.
 *
 * Real sending is enabled when both env vars are set:
 *   GMAIL_USER          → the Gmail address that sends the messages
 *   GMAIL_APP_PASSWORD  → a Google "App password" (2FA required)
 * Without them the message is stored in the EmailLog (status QUEUED) so the
 * owner can still inspect/copy exactly what the buyer receives.
 */

export function gmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function buildItemsTable(items: DeliveredItem[]): string {
  return items
    .map((item) => {
      const rows =
        item.kind === "ACCOUNT"
          ? (item.accounts ?? [])
              .map(
                (a, i) =>
                  `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;">Account ${i + 1}</td>` +
                  `<td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;"><b>${escapeHtml(
                    a.email
                  )}</b> / ${escapeHtml(a.password)}</td></tr>`
              )
              .join("")
          : (item.codes ?? [])
              .map(
                (c, i) =>
                  `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;">Key ${i + 1}</td>` +
                  `<td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;"><b>${escapeHtml(
                    c
                  )}</b></td></tr>`
              )
              .join("");

      return `
        <div style="margin:0 0 18px;">
          <p style="margin:0 0 6px;font-size:15px;font-weight:700;">${escapeHtml(
            item.emoji + " " + item.title
          )} × ${item.quantity}</p>
          <table style="border-collapse:collapse;width:100%;background:#fafafa;border-radius:8px;">${rows}</table>
          ${
            item.instructions
              ? `<p style="margin:8px 0 0;font-size:12px;color:#666;"><b>How to activate:</b><br/>${escapeHtml(
                  item.instructions
                )}</p>`
              : ""
          }
        </div>`;
    })
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildDeliveryEmail(order: {
  shortId: string;
  total: number;
  paymentMethod: string;
  items: DeliveredItem[];
}): { subject: string; html: string } {
  const subject = `Your RUDEUSU DIGILAND delivery — order ${order.shortId}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#1a1a2e;">
      <div style="background:linear-gradient(135deg,#7c3aed,#d946ef);padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">RUDEUSU DIGILAND</h1>
        <p style="color:#f0abfc;margin:6px 0 0;font-size:13px;letter-spacing:2px;">INSTANT DIGITAL DELIVERY</p>
      </div>
      <div style="border:1px solid #eee;border-top:0;padding:24px;border-radius:0 0 12px 12px;">
        <p style="margin:0 0 4px;font-size:16px;font-weight:700;">Thank you for your purchase! 🎉</p>
        <p style="margin:0 0 18px;font-size:13px;color:#555;">
          Order <b>${order.shortId}</b> · Paid via ${order.paymentMethod.toUpperCase()} · ${formatMoney(order.total)}<br/>
          Your goods are below — they are also saved forever in “My orders”.
        </p>
        ${buildItemsTable(order.items)}
        <p style="margin:18px 0 0;font-size:12px;color:#888;">
          Need help? Reply to this email — support is available 24/7.<br/>
          — RUDEUSU DIGILAND team
        </p>
      </div>
    </div>`;
  return { subject, html };
}

/** Sends (or queues) the delivery email for a completed order. */
export async function sendDeliveryEmail(order: {
  id: string;
  shortId: string;
  buyerEmail: string;
  total: number;
  paymentMethod: string;
  items: DeliveredItem[];
}): Promise<void> {
  const { subject, html } = buildDeliveryEmail(order);

  if (!gmailConfigured()) {
    await db.emailLog.create({
      data: { to: order.buyerEmail, subject, bodyHtml: html, status: "QUEUED", orderId: order.id },
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"RUDEUSU DIGILAND" <${process.env.GMAIL_USER}>`,
      to: order.buyerEmail,
      subject,
      html,
    });
    await db.emailLog.create({
      data: { to: order.buyerEmail, subject, bodyHtml: html, status: "SENT", orderId: order.id },
    });
  } catch (err) {
    await db.emailLog.create({
      data: {
        to: order.buyerEmail,
        subject,
        bodyHtml: html,
        status: "FAILED",
        error: err instanceof Error ? err.message : "unknown SMTP error",
        orderId: order.id,
      },
    });
  }
}
