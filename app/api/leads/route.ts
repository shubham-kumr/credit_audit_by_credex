import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkLeadRateLimit } from '@/lib/rate-limit';

const LeadRequestSchema = z.object({
  audit_id: z.string().uuid(),
  email: z.string().email('Enter a valid email address').max(255),
  company_name: z.string().max(255).optional(),
  role: z.string().max(100).optional(),
  team_size: z.number().int().min(1).max(100000).optional(),
  _hp: z.string().max(0, 'Honeypot must be empty'),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON' } }, { status: 400 });
  }

  // Honeypot check before full validation
  if (typeof body === 'object' && body !== null && '_hp' in body && (body as any)._hp !== '') {
    return NextResponse.json({ message: 'Report sent! Check your inbox.' }, { status: 200 });
  }

  const parsed = LeadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: parsed.error.errors } },
      { status: 400 }
    );
  }

  // Rate limiting
  const { allowed, retryAfter } = await checkLeadRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  const { audit_id, email, company_name, role, team_size } = parsed.data;

  // Save to DB
  const { supabase } = await import('@/lib/supabase');
  let tier = 'standard';

  if (supabase) {
    try {
      const { data: audit } = await supabase
        .from('audits')
        .select('total_monthly_savings, savings_tier')
        .eq('id', audit_id)
        .single();

      tier = String((audit as any)?.savings_tier ?? 'standard');
      const savingsAtCapture = Number((audit as any)?.total_monthly_savings ?? 0);
      if (savingsAtCapture > 500) tier = 'high_intent';

      await supabase.from('leads').insert({
        audit_id,
        email: email.toLowerCase().trim(),
        company_name: company_name?.trim(),
        role: role?.trim(),
        team_size,
        monthly_savings: savingsAtCapture,
      });
    } catch (err) {
      console.warn('[POST /api/leads] DB insert failed:', err);
      // Don't fail — attempt email anyway
    }
  }

  // Send email (non-blocking — never fails the response)
  sendConfirmationEmail({ email, tier, audit_id }).catch(() => {});

  return NextResponse.json({ message: 'Report sent! Check your inbox.', tier }, { status: 201 });
}

async function sendConfirmationEmail({
  email,
  tier,
  audit_id,
}: {
  email: string;
  tier: string;
  audit_id: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://credexspendlens.vercel.app';
  const auditUrl = `${appUrl}/audit/${audit_id}`;
  const isHighIntent = tier === 'high_intent';

  const subject = isHighIntent
    ? 'Your AI spend audit — significant savings identified'
    : 'Your AI spend audit from SpendLens';

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #292524;">
      <h1 style="font-size: 24px; color: #2e9967; margin-bottom: 8px;">Your AI Spend Audit</h1>
      <p style="color: #78716c; margin-bottom: 24px;">Thanks for using SpendLens. Here's your audit report.</p>
      <a href="${auditUrl}" style="display: inline-block; background: #2e9967; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
        View Full Audit →
      </a>
      ${isHighIntent ? `
        <div style="background: #f0faf4; border: 1px solid #bbe5ce; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <p style="font-weight: 600; color: #1a6643; margin: 0 0 8px;">🎯 You qualify for a free Credex consultation</p>
          <p style="color: #44403c; margin: 0 0 12px; font-size: 14px;">Your savings level means a Credex advisor can often unlock an additional 20%+ through our AI credit program.</p>
          <a href="https://credex.rocks" style="color: #2e9967; font-weight: 600; font-size: 14px;">Book your free consultation →</a>
        </div>
      ` : ''}
      <p style="font-size: 12px; color: #a8a29e; margin-top: 24px;">SpendLens by Credex · <a href="${appUrl}" style="color: #a8a29e;">spendlens.app</a></p>
    </div>
  `;

  // 1. Hybrid SMTP support (e.g. Gmail SMTP)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"SpendLens" <${smtpUser}>`,
        to: email,
        subject,
        html: htmlContent,
      });
      return; // Succeeded using SMTP
    } catch (smtpErr) {
      console.error('[Email] SMTP send failed:', smtpErr);
      // Fallback to Resend if SMTP fails
    }
  }

  // 2. Fallback to standard Resend pipeline
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(resendKey);
    let fromEmail = process.env.FROM_EMAIL ?? 'onboarding@resend.dev';
    if (fromEmail.includes('@gmail.com') || fromEmail.includes('@yahoo.com') || fromEmail.includes('@outlook.com') || fromEmail.includes('@hotmail.com')) {
      fromEmail = 'onboarding@resend.dev';
    }

    const toEmail = fromEmail === 'onboarding@resend.dev' ? 'shubhamkr6758@gmail.com' : email;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html: htmlContent,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('verify a domain') || msg.includes('validation_error')) {
      console.warn('[Email] Resend test-domain — skipped for', email,
        '| Fix: verify domain at resend.com/domains, set FROM_EMAIL=you@yourdomain.com');
    } else {
      console.warn('[Email] Resend send failed:', msg);
    }
  }
}
