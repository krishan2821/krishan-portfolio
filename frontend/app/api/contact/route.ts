// app/api/contact/route.ts — Contact form handler with email notification via Gmail/Nodemailer
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // ── Check if email credentials are configured ─────────────────────────
    const gmailUser = process.env.GMAIL_USER?.trim()
    const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim()
    const toEmail   = process.env.NOTIFY_EMAIL?.trim() || gmailUser

    if (!gmailUser || !gmailPass) {
      // No email config — log to console and return success (dev mode)
      console.warn('[Contact] Email not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local')
      console.log('📩 Contact form submission:')
      console.log(`  Name   : ${name}`)
      console.log(`  Email  : ${email}`)
      console.log(`  Message: ${message}`)
      return NextResponse.json({ message: "Message received! I'll get back to you soon. 🚀" })
    }

    // ── Try Spring Boot backend first ─────────────────────────────────────
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
    let backendOk = false
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)
      const backendRes = await fetch(`${backendUrl}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      backendOk = backendRes.ok
    } catch {
      console.warn('[Contact] Backend unavailable, using email fallback.')
    }

    // ── Send email via Gmail SMTP ─────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,   // Gmail App Password (not your regular password)
      },
    })

    // Email to YOU (portfolio owner notification)
    const ownerMailOptions = {
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: toEmail,
      subject: `📩 New Message from ${name} — Portfolio`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e2e1; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #a78bfa22, #06b6d422); padding: 32px; border-bottom: 1px solid #2a2a2a;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; background: linear-gradient(to right, #a78bfa, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              New Portfolio Inquiry
            </h1>
            <p style="margin: 8px 0 0; color: #948e9d; font-size: 13px; font-family: 'Fira Code', monospace;">
              📡 Incoming transmission from ${name}
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1c1b1b; color: #948e9d; font-size: 11px; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase; width: 120px;">
                  SENDER
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1c1b1b; color: #e5e2e1; font-size: 15px; font-weight: 600;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1c1b1b; color: #948e9d; font-size: 11px; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase;">
                  EMAIL
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1c1b1b;">
                  <a href="mailto:${email}" style="color: #a78bfa; text-decoration: none; font-size: 14px;">${email}</a>
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px;">
              <p style="color: #948e9d; font-size: 11px; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 12px;">
                MESSAGE BODY
              </p>
              <div style="background: #0e0e0e; border: 1px solid #1c1b1b; border-radius: 8px; padding: 20px; color: #cac4d4; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
${message}
              </div>
            </div>

            <div style="margin-top: 28px; text-align: center;">
              <a href="mailto:${email}?subject=Re: Your Portfolio Inquiry"
                 style="display: inline-block; background: #a78bfa; color: #000; font-weight: 700; font-size: 13px; padding: 12px 28px; border-radius: 8px; text-decoration: none; letter-spacing: 0.05em;">
                REPLY TO ${name.toUpperCase()}
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 16px 32px; border-top: 1px solid #1c1b1b; text-align: center;">
            <p style="margin: 0; color: #494552; font-size: 11px; font-family: monospace;">
              Krishan Kumar Jangid · Portfolio Contact System
            </p>
          </div>
        </div>
      `,
    }

    // Auto-reply email to the SENDER
    const autoReplyOptions = {
      from: `"Krishan Kumar Jangid" <${gmailUser}>`,
      to: email,
      subject: `Got your message, ${name}! 🚀`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e2e1; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
          <div style="background: linear-gradient(135deg, #a78bfa22, #4ade8022); padding: 32px; border-bottom: 1px solid #2a2a2a;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #e5e2e1;">
              Hey ${name}! 👋
            </h1>
            <p style="margin: 8px 0 0; color: #948e9d; font-size: 13px;">
              Message received loud and clear.
            </p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #cac4d4; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
              Thanks for reaching out! I've received your message and will get back to you within <strong style="color: #a78bfa;">24–48 hours</strong>.
            </p>
            <div style="background: #0e0e0e; border: 1px solid #1c1b1b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #494552; font-size: 11px; font-family: monospace; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.1em;">Your message</p>
              <p style="color: #948e9d; font-size: 14px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #948e9d; font-size: 13px; margin: 0;">
              — Krishan Kumar Jangid<br>
              <span style="color: #494552; font-family: monospace;">Full-Stack Engineer · Spring Boot · Next.js</span>
            </p>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid #1c1b1b; text-align: center;">
            <p style="margin: 0; color: #494552; font-size: 11px; font-family: monospace;">
              This is an automated response from Krishan's portfolio.
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(ownerMailOptions)
    await transporter.sendMail(autoReplyOptions)

    console.log(`✅ Email sent for contact from: ${name} <${email}>`)

    return NextResponse.json({
      message: backendOk
        ? "Message dispatched to all nodes! 🚀"
        : "Message received! I'll get back to you within 24 hours. 🚀"
    })

  } catch (err) {
    console.error('[Contact] Handler error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
