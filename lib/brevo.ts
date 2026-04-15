interface BrevoSendEmailParams {
  toEmail: string;
  resetUrl: string;
}

interface BrevoResponse {
  messageId?: string;
  code?: string;
  message?: string;
}

function buildResetEmailHtml(resetUrl: string): string {
  const imageUrl = process.env.BREVO_EMAIL_IMAGE_URL;

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f7fb;padding:24px;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e8f0;">
        ${imageUrl ? `<img src="${imageUrl}" alt="Veltron" style="width:100%;display:block;max-height:220px;object-fit:cover;"/>` : ""}
        <div style="padding:24px;">
          <h2 style="margin:0 0 12px;color:#12141a;">Reset your password</h2>
          <p style="margin:0 0 18px;color:#4b5565;line-height:1.6;">
            We received a request to reset your Veltron password. This link is valid for 30 minutes.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">
            Reset Password
          </a>
          <p style="margin:18px 0 0;color:#6b7280;line-height:1.6;font-size:13px;">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendPasswordResetEmail({ toEmail, resetUrl }: BrevoSendEmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "Veltron";

  if (!apiKey || !senderEmail) {
    throw new Error("Missing Brevo configuration. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [{ email: toEmail }],
      subject: "Reset your Veltron password",
      htmlContent: buildResetEmailHtml(resetUrl),
    }),
  });

  if (!response.ok) {
    let payload: BrevoResponse | null = null;
    try {
      payload = (await response.json()) as BrevoResponse;
    } catch {
      payload = null;
    }

    const detail = payload?.message ?? payload?.code ?? "Unknown Brevo API error.";
    throw new Error(`Brevo email send failed: ${detail}`);
  }
}