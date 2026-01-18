/**
 * Email Queue System
 * 
 * Simple in-memory email queue for asynchronous email sending.
 * Prevents blocking operations and provides retry functionality.
 * 
 * @module lib/email/queue
 * @category Library - Email
 * 
 * Features:
 * - Asynchronous email sending
 * - Automatic retry on failure
 * - Queue management
 * - Error handling
 * - Rate limiting
 * 
 * @example
 * ```typescript
 * import { enqueueEmail } from '@/lib/email/queue';
 * 
 * // Add email to queue
 * enqueueEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome</h1>',
 * });
 * ```
 */

import { sendEmail, type EmailOptions, type EmailResult } from './client';

/**
 * Queued email item
 */
interface QueuedEmail {
  id: string;
  email: EmailOptions;
  retries: number;
  maxRetries: number;
  createdAt: Date;
  scheduledAt?: Date;
}

/**
 * Email queue (in-memory)
 * For production, use a proper queue system like Bull/BullMQ with Redis
 */
const emailQueue: QueuedEmail[] = [];
let isProcessing = false;
let processInterval: NodeJS.Timeout | null = null;

/**
 * Configuration
 */
const CONFIG = {
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  processInterval: 2000, // Check queue every 2 seconds
  rateLimit: 10, // Max 10 emails per interval
};

/**
 * Generate unique ID
 */
function generateId(): string {
  return `email-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Add email to queue
 * 
 * @param email - Email options
 * @param options - Queue options
 * @returns Queue item ID
 */
export function enqueueEmail(
  email: EmailOptions,
  options?: {
    maxRetries?: number;
    scheduleAt?: Date;
  }
): string {
  const id = generateId();

  const queuedEmail: QueuedEmail = {
    id,
    email,
    retries: 0,
    maxRetries: options?.maxRetries || CONFIG.maxRetries,
    createdAt: new Date(),
    scheduledAt: options?.scheduleAt,
  };

  emailQueue.push(queuedEmail);

  console.log(`📥 Email queued: ${id} - To: ${email.to}`);

  // Start processing if not already running
  if (!processInterval) {
    startProcessing();
  }

  return id;
}

/**
 * Process email queue
 */
async function processQueue(): Promise<void> {
  if (isProcessing || emailQueue.length === 0) {
    return;
  }

  isProcessing = true;

  try {
    const now = new Date();
    const processableEmails = emailQueue
      .filter(item => !item.scheduledAt || item.scheduledAt <= now)
      .slice(0, CONFIG.rateLimit);

    for (const queuedEmail of processableEmails) {
      const index = emailQueue.findIndex(item => item.id === queuedEmail.id);
      if (index === -1) continue;

      console.log(`📤 Processing email: ${queuedEmail.id}`);

      try {
        const result = await sendEmail(queuedEmail.email);

        if (result.success) {
          // Remove from queue
          emailQueue.splice(index, 1);
          console.log(`✅ Email sent successfully: ${queuedEmail.id}`);
        } else {
          // Retry logic
          queuedEmail.retries++;

          if (queuedEmail.retries >= queuedEmail.maxRetries) {
            // Max retries reached, remove from queue
            emailQueue.splice(index, 1);
            console.error(`❌ Email failed after ${queuedEmail.maxRetries} retries: ${queuedEmail.id}`);
          } else {
            // Schedule retry
            queuedEmail.scheduledAt = new Date(Date.now() + CONFIG.retryDelay);
            console.warn(`⚠️  Email failed, retry ${queuedEmail.retries}/${queuedEmail.maxRetries}: ${queuedEmail.id}`);
          }
        }
      } catch (error: any) {
        console.error(`❌ Error processing email ${queuedEmail.id}:`, error.message);
        
        // Retry logic for exceptions
        queuedEmail.retries++;
        if (queuedEmail.retries >= queuedEmail.maxRetries) {
          emailQueue.splice(index, 1);
        } else {
          queuedEmail.scheduledAt = new Date(Date.now() + CONFIG.retryDelay);
        }
      }
    }
  } finally {
    isProcessing = false;
  }
}

/**
 * Start queue processing
 */
export function startProcessing(): void {
  if (processInterval) {
    return;
  }

  console.log('🚀 Email queue processor started');

  processInterval = setInterval(() => {
    processQueue().catch(error => {
      console.error('Queue processing error:', error);
    });
  }, CONFIG.processInterval);
}

/**
 * Stop queue processing
 */
export function stopProcessing(): void {
  if (processInterval) {
    clearInterval(processInterval);
    processInterval = null;
    console.log('⏸️  Email queue processor stopped');
  }
}

/**
 * Get queue status
 * 
 * @returns Queue statistics
 */
export function getQueueStatus() {
  return {
    total: emailQueue.length,
    pending: emailQueue.filter(item => item.retries === 0).length,
    retrying: emailQueue.filter(item => item.retries > 0).length,
    scheduled: emailQueue.filter(item => item.scheduledAt && item.scheduledAt > new Date()).length,
  };
}

/**
 * Clear queue (for testing)
 */
export function clearQueue(): void {
  emailQueue.length = 0;
  console.log('🗑️  Email queue cleared');
}

/**
 * Send email with queue
 * Convenience function that adds email to queue
 * 
 * @param email - Email options
 * @returns Queue item ID
 */
export function sendEmailQueued(email: EmailOptions): string {
  return enqueueEmail(email);
}

/**
 * Send multiple emails in bulk
 * 
 * @param emails - Array of email options
 * @returns Array of queue IDs
 */
export function sendBulkEmailsQueued(emails: EmailOptions[]): string[] {
  return emails.map(email => enqueueEmail(email));
}

// Auto-start processing on module load
// In production, you might want to control this manually
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  startProcessing();
}
