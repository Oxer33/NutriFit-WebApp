/**
 * ============================================
 * EMAIL SERVICE - INVIO EMAIL VERIFICA
 * ============================================
 * 
 * Servizio per l'invio di email transazionali:
 * - Email di verifica account
 * - Email di reset password
 * - Email di benvenuto
 * 
 * Usa Nodemailer con SMTP (configurabile per qualsiasi provider)
 * Supporta: Gmail, Outlook, AWS SES, Mailgun, SendGrid, etc.
 */

import nodemailer from 'nodemailer'

// =========== TYPES ===========

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// =========== TRANSPORTER ===========

/**
 * Crea transporter Nodemailer
 * Configurabile via variabili d'ambiente
 */
function createTransporter() {
  // Verifica configurazione
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  
  if (!host || !user || !pass) {
    console.warn('[Email] SMTP non configurato. Le email non verranno inviate.')
    return null
  }
  
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true per 465, false per altri port
    auth: {
      user,
      pass
    }
  })
}

// =========== SEND EMAIL ===========

/**
 * Invia email generica
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = createTransporter()
  
  if (!transporter) {
    // In sviluppo, logga email invece di inviarla
    console.log('[Email] === EMAIL DEBUG ===')
    console.log(`To: ${options.to}`)
    console.log(`Subject: ${options.subject}`)
    console.log(`Body: ${options.text || 'HTML email'}`)
    console.log('[Email] ==================')
    return true // Simula successo in dev
  }
  
  try {
    const fromName = process.env.SMTP_FROM_NAME || 'NutriFit'
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
    
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    })
    
    console.log(`[Email] Inviata a ${options.to}`)
    return true
  } catch (error) {
    console.error('[Email] Errore invio:', error)
    return false
  }
}

// =========== EMAIL TEMPLATES ===========

/**
 * Email di verifica account
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verifyUrl = `${baseUrl}/auth/verify?token=${verificationToken}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifica il tuo account NutriFit</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FFFDEC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #86A788, #6b8a6d); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🥗 NutriFit</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Il tuo percorso verso il benessere</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333; font-size: 24px;">Ciao ${name}! 👋</h2>
              
              <p style="margin: 0 0 20px; color: #555; font-size: 16px; line-height: 1.6;">
                Grazie per esserti registrato a <strong>NutriFit</strong>! Siamo entusiasti di averti con noi.
              </p>
              
              <p style="margin: 0 0 30px; color: #555; font-size: 16px; line-height: 1.6;">
                Per completare la registrazione e iniziare a usare l'app, clicca il pulsante qui sotto per verificare la tua email:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #86A788, #6b8a6d); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 12px rgba(134,167,136,0.4);">
                      ✓ Verifica Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #888; font-size: 14px; line-height: 1.6;">
                Se il pulsante non funziona, copia e incolla questo link nel tuo browser:
              </p>
              <p style="margin: 10px 0 0; color: #86A788; font-size: 14px; word-break: break-all;">
                <a href="${verifyUrl}" style="color: #86A788;">${verifyUrl}</a>
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              
              <p style="margin: 0; color: #888; font-size: 13px; line-height: 1.6;">
                ⏰ Questo link scadrà tra <strong>24 ore</strong>.<br>
                Se non hai richiesto questa email, puoi ignorarla.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} NutriFit. Tutti i diritti riservati.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
  
  const text = `
Ciao ${name}!

Grazie per esserti registrato a NutriFit!

Per completare la registrazione, verifica la tua email cliccando questo link:
${verifyUrl}

Il link scadrà tra 24 ore.

Se non hai richiesto questa email, puoi ignorarla.

© ${new Date().getFullYear()} NutriFit
  `
  
  return sendEmail({
    to: email,
    subject: '✓ Verifica il tuo account NutriFit',
    html,
    text
  })
}

/**
 * Email di benvenuto (dopo verifica)
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const appUrl = `${baseUrl}/app`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benvenuto in NutriFit!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FFFDEC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #86A788, #6b8a6d); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Benvenuto!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333; font-size: 24px;">${name}, il tuo account è attivo!</h2>
              
              <p style="margin: 0 0 20px; color: #555; font-size: 16px; line-height: 1.6;">
                Fantastico! Ora puoi iniziare il tuo percorso verso il benessere con NutriFit.
              </p>
              
              <h3 style="margin: 30px 0 15px; color: #333; font-size: 18px;">Ecco cosa puoi fare:</h3>
              
              <ul style="margin: 0; padding: 0 0 0 20px; color: #555; font-size: 15px; line-height: 1.8;">
                <li>📔 <strong>Diario Alimentare</strong> - Traccia i tuoi pasti giornalieri</li>
                <li>🤖 <strong>AI Coach</strong> - Ricevi consigli personalizzati</li>
                <li>📊 <strong>Statistiche</strong> - Monitora i tuoi progressi</li>
                <li>⚖️ <strong>Storico Peso</strong> - Tieni traccia del tuo peso</li>
              </ul>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #86A788, #6b8a6d); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 12px rgba(134,167,136,0.4);">
                      🚀 Inizia Ora
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} NutriFit. Tutti i diritti riservati.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
  
  return sendEmail({
    to: email,
    subject: '🎉 Benvenuto in NutriFit!',
    html,
    text: `Ciao ${name}! Il tuo account NutriFit è attivo. Inizia ora: ${appUrl}`
  })
}

/**
 * Email reset password (per futuro uso)
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Password NutriFit</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDEC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h1 style="color: #86A788;">🔐 Reset Password</h1>
              <p style="color: #555;">Ciao ${name}, hai richiesto di reimpostare la tua password.</p>
              <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: #86A788; color: #fff; text-decoration: none; border-radius: 12px; margin: 20px 0;">
                Reimposta Password
              </a>
              <p style="color: #888; font-size: 13px;">Il link scadrà tra 1 ora.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
  
  return sendEmail({
    to: email,
    subject: '🔐 Reset Password NutriFit',
    html,
    text: `Ciao ${name}, reimposta la tua password: ${resetUrl}`
  })
}
