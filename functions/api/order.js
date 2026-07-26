// POST /api/order — sends order emails via Resend.
// Requires the RESEND_API_KEY environment variable on the Pages project.

const RECIPIENTS = ['ehsan@mkgeggs.com', 'phakisi@mkgeggs.com'];
const FROM = 'MKG Egg Farm <orders@mkgeggs.com>';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  // Honeypot: real visitors never fill this field. Field name is deliberately
  // meaningless so browser autofill never populates it.
  if (data.botcheck) {
    console.log('order dropped: honeypot filled');
    return json({ ok: true });
  }

  const name = String(data.name || '').trim().slice(0, 100);
  const phone = String(data.phone || '').trim().slice(0, 40);
  const item = String(data.item || '').trim().slice(0, 80);
  const qty = String(data.qty || '').trim().slice(0, 10);
  const address = String(data.address || '').trim().slice(0, 300);
  const note = String(data.note || '').trim().slice(0, 1000);
  const unit = item.startsWith('Eggs') ? 'trays' : 'bags';

  if (!name || !phone || !item || !qty || !/^\d+$/.test(qty)) {
    return json({ error: 'Please fill in your name, phone and order.' }, 422);
  }
  if (!env.RESEND_API_KEY) {
    return json({ error: 'Ordering is temporarily unavailable.' }, 503);
  }

  const placed = new Date().toLocaleString('en-GB', {
    timeZone: 'Africa/Maseru',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const row = (label, value, bold) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #e5e2dd;font:14px Georgia,serif;color:#7d7979;white-space:nowrap;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e5e2dd;font:${bold ? 'bold ' : ''}15px Georgia,serif;color:#201f1d;">${value}</td>
    </tr>`;

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f2f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f2f2;padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e5e2dd;border-radius:4px;overflow:hidden;">
    <tr>
      <td style="background:#2d2b2b;padding:26px 32px;border-bottom:3px solid #b68235;">
        <div style="font:normal 26px Georgia,'Times New Roman',serif;color:#f8f4f4;letter-spacing:2px;">MKG <span style="color:#e1ad66;">EGG FARM</span></div>
        <div style="font:12px Georgia,serif;color:#9b9797;letter-spacing:3px;margin-top:4px;">MOKHOTLONG &middot; LESOTHO</div>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px 8px;">
        <div style="font:normal 22px Georgia,serif;color:#201f1d;">New order from mkgeggs.com</div>
        <div style="font:13px Georgia,serif;color:#7d7979;margin-top:6px;">${esc(placed)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e2dd;border-radius:4px;">
          ${row('Order', `${esc(item)} &mdash; <span style="color:#7d5411;">${esc(qty)} ${unit}</span>`, true)}
          ${row('Name', esc(name))}
          ${row('Phone', `<a href="tel:${esc(phone.replace(/[^+\d]/g, ''))}" style="color:#7d5411;">${esc(phone)}</a>`)}
          ${address ? row('Address', esc(address)) : ''}
          ${note ? row('Note', esc(note)) : ''}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 32px 30px;">
        <div style="font:14px Georgia,serif;color:#444141;line-height:1.6;">
          Call the customer back to confirm the price and arrange collection or delivery.
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:#f8f4f4;padding:16px 32px;border-top:1px solid #e5e2dd;">
        <div style="font:12px Georgia,serif;color:#9b9797;">Sent automatically by the MKG Egg Farm website &middot; FEPA Highlands</div>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body></html>`;

  const text = [
    'New order from mkgeggs.com',
    placed,
    '',
    `Order: ${item} — ${qty} ${unit}`,
    `Name:    ${name}`,
    `Phone:   ${phone}`,
    address ? `Address: ${address}` : '',
    note ? `Note:    ${note}` : '',
  ].filter(Boolean).join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: RECIPIENTS,
      subject: `🥚 Order: ${item} — ${qty} ${unit} — ${name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.log('resend error', res.status, await res.text().catch(() => ''));
    return json({ error: 'We could not send your order. Please call us instead.' }, 502);
  }
  console.log('order sent:', item, qty, unit);
  return json({ ok: true });
}
