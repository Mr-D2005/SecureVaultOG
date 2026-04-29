const sendEmail = async (options) => {
  console.log('--- [INITIATING HTTP_API DISPATCH] ---');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ [CRITICAL] RESEND_API_KEY missing from environment!');
    console.error('--- PLEASE ADD RESEND_API_KEY TO RENDER DASHBOARD ---');
    return;
  }

  const payload = {
    from: process.env.RESEND_FROM || 'SecureVault <onboarding@resend.dev>', 
    to: options.email,

    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <div style="background:#050505; color:#fff; padding:40px; font-family:sans-serif; border:1px solid #333; border-radius:12px;">
        <h1 style="color:#8b5cf6;">SECUREVAULT</h1>
        <p style="color:#a1a1aa; font-size:16px;">${options.message.replace(/\n/g, '<br>')}</p>
        ${options.link ? `<a href="${options.link}" style="background:#8b5cf6; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; display:inline-block; margin-top:20px;">Access Vault</a>` : ''}
        <p style="margin-top:40px; font-size:11px; color:#555; border-top:1px solid #222; padding-top:20px;">&copy; 2026 SecureVault Forensics Division</p>
      </div>
    `
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('🚀 [HTTP_API_SUCCESS]:', data.id);
      return data;
    } else {
      console.error('❌ [HTTP_API_FAILURE]:', data);
      throw new Error(data.message || 'HTTP Email Dispatch Failed');
    }
  } catch (err) {
    console.error('❌ [HTTP_API_CRASH]:', err.message);
    throw err;
  }
};

module.exports = sendEmail;
