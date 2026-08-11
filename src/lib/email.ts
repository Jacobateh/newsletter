export const emailSubject = "Verify your Hausa Arabia newsletter subscription";

export function buildVerificationEmailHtml(code: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your Hausa Arabia newsletter subscription</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f2f1ea;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f1ea;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e4d6;">
            <tr>
              <td style="background:#0b3d2e;padding:36px 32px;text-align:center;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#c9a227;letter-spacing:1px;">Hausa Arabia</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#e9d48b;margin-top:6px;letter-spacing:3px;text-transform:uppercase;">Arabic &bull; Hausa &bull; English</div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 24px;">
                <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#0b3d2e;">You&rsquo;re almost there!</h1>
                <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3c4f47;">Use the verification code below to confirm your newsletter subscription:</p>
                <div style="background:#faf8f1;border:2px dashed #c9a227;border-radius:12px;padding:24px;text-align:center;">
                  <span style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:700;letter-spacing:12px;color:#0b3d2e;">${code}</span>
                </div>
                <p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7a72;">Your verification code expires in 10 minutes.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px;">
                <div style="border-top:1px solid #eee9d8;padding-top:20px;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:#8a948d;">If you did not request this subscription, you can safely ignore this email.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#f7f5ef;padding:20px 32px;text-align:center;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#93a09a;">Learn. Connect. Communicate. &mdash; Hausa Arabia Newsletter</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildVerificationEmailText(code: string): string {
  return `HAUSA ARABIA
Arabic - Hausa - English

You're almost there!

Use the verification code below to confirm your newsletter subscription:

${code}

Your verification code expires in 10 minutes.

If you did not request this subscription, you can safely ignore this email.

Learn. Connect. Communicate. - Hausa Arabia Newsletter`;
}
