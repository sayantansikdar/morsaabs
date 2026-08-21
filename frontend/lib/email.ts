/**
 * Transactional email through Resend.
 *
 * The governing rule: **sending must never fail a submission**. An order that
 * reached Postgres is an order the kitchen will cook, whether or not the
 * confirmation email left the building. Every function here returns rather than
 * throws, and callers are expected not to await them on the critical path.
 *
 * Unconfigured is a normal state, not an error — the site ran without email for
 * months and must keep doing so.
 */

import 'server-only'
import { Resend } from 'resend'
import { site, formatPrice, fullAddress } from './site'

let client: Resend | null = null

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

function getResend(): Resend | null {
  if (!isEmailConfigured()) return null
  if (!client) client = new Resend(process.env.RESEND_API_KEY)
  return client
}

type SendResult = { sent: boolean; id?: string; error?: string }

async function send(options: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}): Promise<SendResult> {
  const resend = getResend()
  if (!resend) return { sent: false, error: 'Email is not configured.' }

  try {
    const { data, error } = await resend.emails.send({
      from: `${site.name} <${process.env.RESEND_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })

    if (error) {
      console.error('[email] rejected by Resend', error)
      return { sent: false, error: error.message }
    }
    return { sent: true, id: data?.id }
  } catch (error) {
    console.error('[email] send failed', error)
    return { sent: false, error: error instanceof Error ? error.message : 'unknown' }
  }
}

/* ------------------------------------------------------------- templates -- */

/**
 * Inline styles only, and a table for layout.
 *
 * Email clients are not browsers: Gmail strips <style> blocks, Outlook renders
 * through Word. This is the one place where 2005-era HTML is the correct
 * answer.
 */
function layout(heading: string, body: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f3ec;font-family:Georgia,'Times New Roman',serif;color:#2b1b1d">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e5ddcc">
    <tr><td style="padding:28px 32px">
      <p style="margin:0 0 4px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#9a7b3f">${escapeHtml(site.name)}</p>
      <h1 style="margin:0 0 18px;font-size:22px;font-weight:700;color:#2b1b1d">${escapeHtml(heading)}</h1>
      ${body}
      <hr style="border:none;border-top:1px solid #e5ddcc;margin:26px 0 16px">
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b5b4d">
        ${escapeHtml(fullAddress)}<br>
        <a href="tel:${escapeHtml(site.phone)}" style="color:#7a1f2b">${escapeHtml(site.phoneDisplay)}</a>
      </p>
    </td></tr>
  </table>
</body></html>`
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:5px 0;font-size:14px;color:#6b5b4d;width:132px">${escapeHtml(label)}</td>
    <td style="padding:5px 0;font-size:14px;color:#2b1b1d"><strong>${escapeHtml(value)}</strong></td>
  </tr>`
}

/** Anything interpolated here came from a form, so it is escaped, not trusted. */
function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/* ---------------------------------------------------------------- orders -- */

export type OrderEmailData = {
  reference: string
  name: string
  phone: string
  mode: string
  address?: string | null
  total: number
  paymentMethod: string
  items: { name: string; quantity: number; lineTotal: number }[]
}

/** Tells the kitchen an order has landed. Subject leads with what to act on. */
export async function sendOrderNotification(order: OrderEmailData): Promise<SendResult> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL
  if (!to) return { sent: false, error: 'ADMIN_NOTIFICATION_EMAIL is not set.' }

  const lines = order.items
    .map(
      (item) =>
        `<tr><td style="padding:4px 0;font-size:14px">${escapeHtml(item.name)} × ${item.quantity}</td>
         <td style="padding:4px 0;font-size:14px;text-align:right">${formatPrice(item.lineTotal)}</td></tr>`
    )
    .join('')

  return send({
    to,
    subject: `New ${order.mode} order ${order.reference} — ${formatPrice(order.total)}`,
    // So staff can reply straight to the guest where a mail client allows it.
    html: layout(
      `New order · ${order.reference}`,
      `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">
        ${row('Guest', order.name)}
        ${row('Phone', order.phone)}
        ${row('Type', order.mode)}
        ${order.address ? row('Address', order.address) : ''}
        ${row('Payment', order.paymentMethod)}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:18px;border-top:1px solid #e5ddcc">
        ${lines}
        <tr><td style="padding:10px 0 0;font-size:15px"><strong>Total</strong></td>
            <td style="padding:10px 0 0;font-size:15px;text-align:right"><strong>${formatPrice(order.total)}</strong></td></tr>
      </table>`
    ),
  })
}

/* ----------------------------------------------------------- reservations -- */

export type ReservationEmailData = {
  reference: string
  name: string
  phone: string
  email?: string | null
  date: string
  time: string
  guests: number
  occasion?: string | null
}

export async function sendReservationConfirmation(
  booking: ReservationEmailData
): Promise<SendResult> {
  if (!booking.email) return { sent: false, error: 'No guest email on the booking.' }

  return send({
    to: booking.email,
    subject: `Your table at ${site.name} — ${booking.reference}`,
    html: layout(
      'We have your booking',
      `<p style="margin:0 0 16px;font-size:15px;line-height:1.6">
        Thank you, ${escapeHtml(booking.name)}. We will call ${escapeHtml(booking.phone)}
        shortly to confirm.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">
        ${row('Reference', booking.reference)}
        ${row('Date', booking.date)}
        ${row('Time', booking.time)}
        ${row('Guests', String(booking.guests))}
        ${booking.occasion ? row('Occasion', booking.occasion) : ''}
      </table>
      <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#6b5b4d">
        Need to change anything? Reply to this email or call us.
      </p>`
    ),
  })
}

export async function sendReservationNotification(
  booking: ReservationEmailData
): Promise<SendResult> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL
  if (!to) return { sent: false, error: 'ADMIN_NOTIFICATION_EMAIL is not set.' }

  return send({
    to,
    subject: `Table booking ${booking.reference} — ${booking.date} ${booking.time}, ${booking.guests} guests`,
    replyTo: booking.email || undefined,
    html: layout(
      `New booking · ${booking.reference}`,
      `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">
        ${row('Guest', booking.name)}
        ${row('Phone', booking.phone)}
        ${booking.email ? row('Email', booking.email) : ''}
        ${row('Date', booking.date)}
        ${row('Time', booking.time)}
        ${row('Guests', String(booking.guests))}
        ${booking.occasion ? row('Occasion', booking.occasion) : ''}
      </table>`
    ),
  })
}

/* ---------------------------------------------------------------- contact -- */

export type ContactEmailData = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function sendContactNotification(
  enquiry: ContactEmailData
): Promise<SendResult> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL
  if (!to) return { sent: false, error: 'ADMIN_NOTIFICATION_EMAIL is not set.' }

  return send({
    to,
    subject: `${enquiry.subject} enquiry from ${enquiry.name}`,
    // Replying in the mail client reaches the sender, not us.
    replyTo: enquiry.email,
    html: layout(
      `New ${escapeHtml(enquiry.subject)} enquiry`,
      `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">
        ${row('From', enquiry.name)}
        ${row('Email', enquiry.email)}
        ${row('Phone', enquiry.phone)}
      </table>
      <p style="margin:18px 0 0;padding:14px;background:#f6f3ec;border-radius:8px;font-size:14px;line-height:1.7;white-space:pre-line">${escapeHtml(
        enquiry.message
      )}</p>`
    ),
  })
}
