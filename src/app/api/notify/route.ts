import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize APIs if keys are present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'reservations@redzrestaurant.com'; // Change this to verified domain
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || 'info@redzrestaurant.com';
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || '';
const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    let emailSubject = '';
    let emailHtml = '';
    let smsBody = '';

    if (type === 'reservation') {
      emailSubject = `Reservation Confirmation - Redz Restaurant`;
      emailHtml = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #BA1C21;">Redz Restaurant</h2>
          <p>Hi ${data.name},</p>
          <p>Your reservation request has been received!</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Party Size:</strong> ${data.party_size}</p>
            ${data.special_requests ? `<p><strong>Special Requests:</strong> ${data.special_requests}</p>` : ''}
          </div>
          <p>We look forward to serving you.</p>
        </div>
      `;
      smsBody = `Redz Restaurant: Hi ${data.name}, your reservation request for ${data.party_size} on ${data.date} at ${data.time} has been received!`;
    } else if (type === 'banquet') {
      emailSubject = `Banquet Inquiry Received - Redz Restaurant`;
      emailHtml = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #BA1C21;">Redz Restaurant Banquets</h2>
          <p>Hi ${data.name},</p>
          <p>We've received your banquet inquiry for ${data.guest_count} guests on ${data.event_date}.</p>
          <p>Our event coordinator will reach out to you shortly at ${data.phone} to discuss details.</p>
        </div>
      `;
      smsBody = `Redz Restaurant: Hi ${data.name}, we received your banquet inquiry for ${data.event_date}. Our team will contact you shortly!`;
    }

    // 1. Send Emails via Resend
    if (resend && data.email) {
      try {
        // Send to Customer
        await resend.emails.send({
          from: `Redz Restaurant <${FROM_EMAIL}>`,
          to: data.email,
          subject: emailSubject,
          html: emailHtml
        });
        
        // Send Notification to Restaurant
        await resend.emails.send({
          from: `Redz System <${FROM_EMAIL}>`,
          to: RESTAURANT_EMAIL,
          subject: `NEW ${type.toUpperCase()}: ${data.name}`,
          html: emailHtml
        });
      } catch (err) {
        console.error("Resend Email Error:", err);
      }
    } else if (!resend) {
      console.warn("Resend API Key missing. Skipping emails.");
    }

    // 2. Send SMS via Twilio
    if (twilioClient && data.phone && TWILIO_PHONE) {
      try {
        // Send to Customer
        await twilioClient.messages.create({
          body: smsBody,
          from: TWILIO_PHONE,
          to: data.phone
        });

        // Send Notification to Restaurant (optional)
        if (RESTAURANT_PHONE) {
          await twilioClient.messages.create({
            body: `New ${type} request from ${data.name}: ${data.phone}`,
            from: TWILIO_PHONE,
            to: RESTAURANT_PHONE
          });
        }
      } catch (err) {
        console.error("Twilio SMS Error:", err);
      }
    } else if (!twilioClient) {
      console.warn("Twilio credentials missing. Skipping SMS.");
    }

    return NextResponse.json({ success: true, message: "Notifications processed." });

  } catch (error: any) {
    console.error("Notification Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
