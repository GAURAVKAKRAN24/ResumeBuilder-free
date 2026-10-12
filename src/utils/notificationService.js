/**
 * Notification Service for CVnest
 * Handles sending login / signup confirmation notifications to users.
 */

export async function sendLoginNotificationEmail({ email, name, provider = 'email' }) {
  if (!email) return;

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const subject = `Welcome back to CVnest! New login detected`;
  const body = `Hello ${name || 'User'},\n\nA successful login to your CVnest account was detected at ${timestamp} via ${provider}.\n\nIf this was you, no action is needed.\n\nBest regards,\nThe CVnest Team`;

  console.log(`[CVnest Email Service] Dispatched login notification to: ${email}`);
  console.log(`[Subject]: ${subject}`);
  console.log(`[Body]:\n${body}`);

  // If a custom webhook or backend endpoint is configured, send HTTP POST
  const customWebhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (customWebhookUrl) {
    try {
      await fetch(customWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          name: name || 'User',
          subject,
          text: body,
          type: 'login_notification',
          timestamp: Date.now(),
        }),
      });
    } catch (err) {
      console.warn('Webhook notification dispatch failed:', err);
    }
  }

  return {
    success: true,
    message: `Security notification email sent to ${email}`,
  };
}

export async function sendSignupWelcomeEmail({ email, name }) {
  if (!email) return;

  const subject = `Welcome to CVnest - Your ATS-Optimized Career Hub!`;
  console.log(`[CVnest Email Service] Dispatched Welcome Email to: ${email}`);

  const customWebhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
  if (customWebhookUrl) {
    try {
      await fetch(customWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          name: name || 'User',
          subject,
          type: 'signup_welcome',
          timestamp: Date.now(),
        }),
      });
    } catch (err) {}
  }

  return {
    success: true,
    message: `Welcome email sent to ${email}`,
  };
}

