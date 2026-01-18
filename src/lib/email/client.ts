/**
 * Email Client Module
 * 
 * Email sending functionality using Nodemailer.
 * Supports HTML templates, attachments, and multiple transports.
 * 
 * @module lib/email/client
 * @category Library - Email
 * 
 * Features:
 * - HTML email templates
 * - Attachment support
 * - SMTP transport
 * - Queue integration ready
 * - Template rendering
 * 
 * Environment Variables:
 * - EMAIL_HOST: SMTP server host
 * - EMAIL_PORT: SMTP server port
 * - EMAIL_USER: SMTP username
 * - EMAIL_PASSWORD: SMTP password
 * - EMAIL_FROM: Default sender email
 * - EMAIL_FROM_NAME: Default sender name
 * 
 * @example
 * ```typescript
 * import { sendEmail } from '@/lib/email/client';
 * 
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome to our platform</h1>',
 * });
 * ```
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Email configuration
 */
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

/**
 * Email message options
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
  replyTo?: string;
}

/**
 * Email sending result
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Get email configuration from environment variables
 */
function getEmailConfig(): EmailConfig {
  return {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Escort Platform',
      email: process.env.EMAIL_FROM || 'noreply@example.com',
    },
  };
}

/**
 * Create email transporter
 */
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const config = getEmailConfig();

  // Check if email is configured
  if (!config.auth.user || !config.auth.pass) {
    console.warn('⚠️  Email credentials not configured. Emails will not be sent.');
    
    // Return test transporter for development
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'test',
      },
    });
    
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  });

  return transporter;
}

/**
 * Send an email
 * 
 * @param options - Email options
 * @returns Email result
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const config = getEmailConfig();
    const transport = getTransporter();

    // Prepare email
    const mailOptions = {
      from: `"${config.from.name}" <${config.from.email}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
      replyTo: options.replyTo,
    };

    // Send email
    const info = await transport.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);
    console.log('   To:', options.to);
    console.log('   Subject:', options.subject);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify email configuration
 * 
 * @returns True if email is properly configured
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error: any) {
    console.error('❌ Email configuration is invalid:', error.message);
    return false;
  }
}

/**
 * Send bulk emails
 * 
 * @param emails - Array of email options
 * @returns Array of results
 */
export async function sendBulkEmails(
  emails: EmailOptions[]
): Promise<EmailResult[]> {
  const results: EmailResult[] = [];

  for (const email of emails) {
    const result = await sendEmail(email);
    results.push(result);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Create email preview URL (for development)
 * 
 * @param info - Nodemailer message info
 * @returns Preview URL
 */
export function getPreviewUrl(messageId: string): string {
  return nodemailer.getTestMessageUrl({ messageId } as any) || '';
}
