import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize APIs if keys are present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'reservations@redzrestaurant.com';
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || 'info@redzrestaurant.com';
/** Director of Sales & Marketing — private dining / event inquiry handoffs */
const DOSM_EMAIL = process.env.DOSM_EMAIL || RESTAURANT_EMAIL;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || '';
const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || '';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://redzrestaurant.com').replace(/\/$/, '');

// User-supplied values are interpolated into email HTML — escape to prevent HTML injection
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseRecipients(value: string): string[] {
  return value
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

/** Hilton wedding / catering handoff — always CC'd on contact & event leads */
const HILTON_EVENT_EMAILS = parseRecipients(
  process.env.HILTON_EVENT_EMAILS || 'weddings@hilton.com,catering@hilton.com'
);

function uniqueEmails(...groups: string[][]): string[] {
  return [...new Set(groups.flat().map((e) => e.trim()).filter(Boolean))];
}

function formatDisplayDate(value?: string): string {
  if (!value) return 'Not specified';
  // Prefer yyyy-mm-dd from the form; fall back to raw string
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function occasionFromEventType(eventType?: string): string {
  if (!eventType) return 'Private Dining';
  const parts = eventType.split('—').map((p) => p.trim());
  return parts.length > 1 ? parts.slice(1).join('—') : eventType;
}

export type NotificationType = 'reservation' | 'banquet' | 'private_dining' | 'contact';

export type NotificationData = {
  name: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  party_size?: number | string;
  event_type?: string;
  event_date?: string;
  guest_count?: number | string;
  special_requests?: string;
  message?: string;
};

type BuiltNotification = {
  guestSubject: string;
  guestHtml: string;
  staffSubject: string;
  staffHtml: string;
  staffTo: string[];
  smsBody: string;
  staffSmsBody: string;
};

function detailRow(label: string, value: string, opts?: { href?: string }) {
  const content = opts?.href
    ? `<a href="${esc(opts.href)}" style="color: #BA1C21; text-decoration: none;">${esc(value)}</a>`
    : esc(value);
  return `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8; color: #666; width: 140px; vertical-align: top; font-size: 14px;">${esc(label)}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8; color: #111; font-size: 14px; font-weight: 600;">${content}</td>
    </tr>
  `;
}

function emailShell(title: string, body: string) {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #222;">
      <div style="border-bottom: 3px solid #BA1C21; padding-bottom: 12px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 22px; color: #BA1C21; letter-spacing: 0.02em;">Redz Restaurant</h1>
        <p style="margin: 6px 0 0; font-size: 13px; color: #666; font-family: sans-serif;">${esc(title)}</p>
      </div>
      ${body}
      <p style="margin-top: 32px; font-size: 12px; color: #999; font-family: sans-serif;">
        Redz Restaurant · Mt Laurel, NJ · <a href="${esc(SITE_URL)}" style="color: #BA1C21;">${esc(SITE_URL.replace(/^https?:\/\//, ''))}</a>
      </p>
    </div>
  `;
}

function buildPrivateDiningGuestEmail(data: NotificationData): { subject: string; html: string } {
  const occasion = occasionFromEventType(data.event_type);
  const dateLabel = formatDisplayDate(data.event_date);
  const subject = `Private Dining Inquiry Received — Redz Restaurant`;
  const html = emailShell(
    'Private Dining Inquiry',
    `
      <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6;">Hi ${esc(data.name)},</p>
      <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6;">
        Thank you for your private dining inquiry. We've received your request and our Director of Sales &amp; Marketing will follow up shortly to confirm availability and tailor the experience.
      </p>
      <table style="width: 100%; border-collapse: collapse; background: #f7f7f7; border-radius: 8px; overflow: hidden; font-family: sans-serif; margin: 24px 0;">
        ${detailRow('Occasion', occasion)}
        ${detailRow('Preferred date', dateLabel)}
        ${detailRow('Guest count', String(data.guest_count ?? '—'))}
        ${data.phone ? detailRow('Phone', data.phone, { href: `tel:${data.phone}` }) : ''}
        ${data.special_requests ? detailRow('Notes', data.special_requests) : ''}
      </table>
      <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6;">
        Questions in the meantime? Call us at <a href="tel:18567788999" style="color: #BA1C21;">856.778.8999</a>.
      </p>
    `
  );
  return { subject, html };
}

function buildPrivateDiningStaffEmail(data: NotificationData): { subject: string; html: string } {
  const occasion = occasionFromEventType(data.event_type);
  const dateLabel = formatDisplayDate(data.event_date);
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const subject = `NEW Private Dining Inquiry: ${data.name} — ${dateLabel} (${data.guest_count} guests)`;
  const html = emailShell(
    'DOSM Action Required — Private Dining Lead',
    `
      <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; margin-top: 0;">
        A new private dining inquiry was submitted on <a href="${esc(SITE_URL)}/private-dining" style="color: #BA1C21;">redzrestaurant.com/private-dining</a>. Reply to this email to contact the guest directly.
      </p>
      <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden; font-family: sans-serif; margin: 20px 0;">
        ${detailRow('Guest name', data.name)}
        ${data.email ? detailRow('Email', data.email, { href: `mailto:${data.email}` }) : detailRow('Email', 'Not provided')}
        ${data.phone ? detailRow('Phone', data.phone, { href: `tel:${data.phone}` }) : detailRow('Phone', 'Not provided')}
        ${detailRow('Occasion', occasion)}
        ${detailRow('Event type (CRM)', data.event_type || 'Private Dining')}
        ${detailRow('Preferred date', dateLabel)}
        ${detailRow('Guest count', String(data.guest_count ?? '—'))}
        ${detailRow('Special requests', data.special_requests?.trim() ? data.special_requests : 'None')}
        ${detailRow('Submitted (ET)', submittedAt)}
        ${detailRow('Source', `${SITE_URL}/private-dining`)}
      </table>
      <p style="font-family: sans-serif; font-size: 13px; color: #666; line-height: 1.5;">
        This lead is also saved in the CRM under <strong>Leads / Contact</strong>.
      </p>
    `
  );
  return { subject, html };
}

function buildNotification(type: NotificationType, data: NotificationData): BuiltNotification {
  if (type === 'reservation') {
    const guestSubject = `Reservation Confirmation - Redz Restaurant`;
    const guestHtml = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2 style="color: #BA1C21;">Redz Restaurant</h2>
        <p>Hi ${esc(data.name)},</p>
        <p>Your reservation request has been received!</p>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
          <p><strong>Date:</strong> ${esc(data.date)}</p>
          <p><strong>Time:</strong> ${esc(data.time)}</p>
          <p><strong>Party Size:</strong> ${esc(data.party_size)}</p>
          ${data.special_requests ? `<p><strong>Special Requests:</strong> ${esc(data.special_requests)}</p>` : ''}
        </div>
        <p>We look forward to serving you.</p>
      </div>
    `;
    return {
      guestSubject,
      guestHtml,
      staffSubject: `NEW RESERVATION: ${data.name}`,
      staffHtml: guestHtml,
      staffTo: parseRecipients(RESTAURANT_EMAIL),
      smsBody: `Redz Restaurant: Hi ${data.name}, your reservation request for ${data.party_size} on ${data.date} at ${data.time} has been received!`,
      staffSmsBody: `New reservation from ${data.name}: ${data.phone || 'no phone'} — ${data.party_size} on ${data.date} at ${data.time}`,
    };
  }

  if (type === 'private_dining') {
    const guest = buildPrivateDiningGuestEmail(data);
    const staff = buildPrivateDiningStaffEmail(data);
    const occasion = occasionFromEventType(data.event_type);
    return {
      guestSubject: guest.subject,
      guestHtml: guest.html,
      staffSubject: staff.subject,
      staffHtml: staff.html,
      staffTo: uniqueEmails(parseRecipients(DOSM_EMAIL), HILTON_EVENT_EMAILS),
      smsBody: `Redz Restaurant: Hi ${data.name}, we received your private dining inquiry for ${data.guest_count} guests on ${data.event_date}. Our team will contact you shortly!`,
      staffSmsBody: `Private dining lead: ${data.name} | ${occasion} | ${data.guest_count} guests | ${data.event_date} | ${data.phone || data.email || ''}`,
    };
  }

  if (type === 'banquet') {
    const guestSubject = `Banquet Inquiry Received - Redz Restaurant`;
    const guestHtml = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2 style="color: #BA1C21;">Redz Restaurant Banquets</h2>
        <p>Hi ${esc(data.name)},</p>
        <p>We've received your banquet inquiry for ${esc(data.guest_count)} guests on ${esc(data.event_date)}.</p>
        <p>Our event coordinator will reach out to you shortly at ${esc(data.phone)} to discuss details.</p>
      </div>
    `;
    const staffHtml = emailShell(
      'Banquet / Event Lead',
      `
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
          ${detailRow('Guest name', data.name)}
          ${data.email ? detailRow('Email', data.email, { href: `mailto:${data.email}` }) : ''}
          ${data.phone ? detailRow('Phone', data.phone, { href: `tel:${data.phone}` }) : ''}
          ${detailRow('Event type', data.event_type || 'Banquet')}
          ${detailRow('Event date', formatDisplayDate(data.event_date))}
          ${detailRow('Guest count', String(data.guest_count ?? '—'))}
          ${detailRow('Special requests', data.special_requests?.trim() ? data.special_requests : 'None')}
        </table>
      `
    );
    return {
      guestSubject,
      guestHtml,
      staffSubject: `NEW BANQUET INQUIRY: ${data.name}`,
      staffHtml,
      staffTo: uniqueEmails(parseRecipients(DOSM_EMAIL), HILTON_EVENT_EMAILS),
      smsBody: `Redz Restaurant: Hi ${data.name}, we received your banquet inquiry for ${data.event_date}. Our team will contact you shortly!`,
      staffSmsBody: `New banquet request from ${data.name}: ${data.phone || ''}`,
    };
  }

  // contact
  const guestSubject = `We received your message - Redz Restaurant`;
  const guestHtml = `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #BA1C21;">Redz Restaurant</h2>
      <p>Hi ${esc(data.name)},</p>
      <p>Thanks for reaching out — we've received your message and will get back to you shortly.</p>
      <div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
        <p><strong>Your message:</strong></p>
        <p>${esc(data.message)}</p>
      </div>
    </div>
  `;
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const staffHtml = emailShell(
    'New Contact Message',
    `
      <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; margin-top: 0;">
        A new contact message was submitted on <a href="${esc(SITE_URL)}/contact" style="color: #BA1C21;">redzrestaurant.com/contact</a>. Reply to this email to contact the guest directly.
      </p>
      <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden; font-family: sans-serif; margin: 20px 0;">
        ${detailRow('Guest name', data.name)}
        ${data.email ? detailRow('Email', data.email, { href: `mailto:${data.email}` }) : detailRow('Email', 'Not provided')}
        ${data.phone ? detailRow('Phone', data.phone, { href: `tel:${data.phone}` }) : detailRow('Phone', 'Not provided')}
        ${detailRow('Message', data.message?.trim() ? data.message : 'None')}
        ${detailRow('Submitted (ET)', submittedAt)}
        ${detailRow('Source', `${SITE_URL}/contact`)}
      </table>
      <p style="font-family: sans-serif; font-size: 13px; color: #666; line-height: 1.5;">
        This lead is also saved in the CRM under <strong>Leads / Contact</strong>.
      </p>
    `
  );
  return {
    guestSubject,
    guestHtml,
    staffSubject: `NEW CONTACT: ${data.name}`,
    staffHtml,
    staffTo: uniqueEmails(parseRecipients(RESTAURANT_EMAIL), HILTON_EVENT_EMAILS),
    smsBody: '',
    staffSmsBody: `New contact message from ${data.name}: ${data.phone || data.email || ''}`,
  };
}

export async function sendNotifications(type: NotificationType, data: NotificationData) {
  const built = buildNotification(type, data);

  if (resend && data.email) {
    try {
      await resend.emails.send({
        from: `Redz Restaurant <${FROM_EMAIL}>`,
        to: data.email,
        subject: built.guestSubject,
        html: built.guestHtml,
      });

      if (built.staffTo.length > 0) {
        await resend.emails.send({
          from: `Redz System <${FROM_EMAIL}>`,
          to: built.staffTo,
          replyTo: data.email,
          subject: built.staffSubject,
          html: built.staffHtml,
        });
      }
    } catch (err) {
      console.error('Resend Email Error:', err);
    }
  } else if (!resend) {
    console.warn('Resend API Key missing. Skipping emails.');
  }

  if (twilioClient && data.phone && TWILIO_PHONE) {
    try {
      if (built.smsBody) {
        await twilioClient.messages.create({
          body: built.smsBody,
          from: TWILIO_PHONE,
          to: data.phone,
        });
      }

      if (RESTAURANT_PHONE && built.staffSmsBody) {
        await twilioClient.messages.create({
          body: built.staffSmsBody,
          from: TWILIO_PHONE,
          to: RESTAURANT_PHONE,
        });
      }
    } catch (err) {
      console.error('Twilio SMS Error:', err);
    }
  } else if (!twilioClient) {
    console.warn('Twilio credentials missing. Skipping SMS.');
  }
}
