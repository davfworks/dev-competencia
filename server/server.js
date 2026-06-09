const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('ERROR: server/config.json no encontrado. Copia config.json y rellena tus datos SMTP.');
  process.exit(1);
}
const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: cfg.frontendOrigin || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' })); // permite paymentProof en base64

const transporter = nodemailer.createTransport({
  host: cfg.smtp.host,
  port: cfg.smtp.port,
  secure: cfg.smtp.secure,
  auth: {
    user: cfg.smtp.auth.user,
    pass: cfg.smtp.auth.pass,
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseProof(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;
  const mimeType = match[1];
  const ext = mimeType.split('/')[1] || 'jpg';
  return { mimeType, ext, buffer: Buffer.from(match[2], 'base64') };
}

// ── Email templates ───────────────────────────────────────────────────────────
function participantHtml(data) {
  const isTeam = data.type === 'team';
  const membersRows = isTeam && Array.isArray(data.members)
    ? data.members.map((m, i) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">${i + 1}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">${m.fullName}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">${m.email}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">${m.gender}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">${m.jerseySize}</td>
        </tr>`).join('')
    : '';

  const infoRows = isTeam
    ? `
      <tr><td style="${tdL}"><strong>Equipo</strong></td><td style="${tdR}">${data.teamName}</td></tr>
      <tr><td style="${tdL}"><strong>Representante</strong></td><td style="${tdR}">${data.representativeName}</td></tr>
      <tr><td style="${tdL}"><strong>Email</strong></td><td style="${tdR}">${data.email}</td></tr>
      <tr><td style="${tdL}"><strong>Teléfono</strong></td><td style="${tdR}">${data.phone}</td></tr>
      <tr><td style="${tdL}"><strong>Integrantes</strong></td><td style="${tdR}">${data.members.length}</td></tr>`
    : `
      <tr><td style="${tdL}"><strong>Nombre</strong></td><td style="${tdR}">${data.fullName}</td></tr>
      <tr><td style="${tdL}"><strong>Email</strong></td><td style="${tdR}">${data.email}</td></tr>
      <tr><td style="${tdL}"><strong>Teléfono</strong></td><td style="${tdR}">${data.phone}</td></tr>
      <tr><td style="${tdL}"><strong>Ciudad</strong></td><td style="${tdR}">${data.city}, ${data.country}</td></tr>
      <tr><td style="${tdL}"><strong>Género</strong></td><td style="${tdR}">${data.gender}</td></tr>
      <tr><td style="${tdL}"><strong>Talla Jersey</strong></td><td style="${tdR}">${data.jerseySize}</td></tr>
      ${data.observations ? `<tr><td style="${tdL}"><strong>Observaciones</strong></td><td style="${tdR}">${data.observations}</td></tr>` : ''}`;

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111;background:#fff">
      <!-- Header -->
      <div style="background:#ea580c;padding:28px 32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-style:italic;text-transform:uppercase;font-size:22px;letter-spacing:2px">
          Travesía Rieles del Lago 2026
        </h1>
      </div>

      <div style="padding:32px">
        <h2 style="margin-top:0">¡Tu inscripción ha sido confirmada!</h2>
        <p style="color:#555">Gracias por inscribirte. Tu comprobante de pago fue recibido y tu registro está completo.</p>

        <!-- Confirmation code -->
        <div style="background:#111;color:#fff;padding:20px 24px;margin:24px 0;text-align:center;border-radius:2px">
          <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#9ca3af">
            Código de Confirmación
          </p>
          <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:6px;font-family:monospace">
            ${data.confirmationCode}
          </p>
        </div>

        <p style="color:#555;font-size:14px">
          Guarda este código — lo necesitarás el día del evento para verificar tu inscripción.
        </p>

        <!-- Registration details -->
        <h3 style="border-bottom:2px solid #ea580c;padding-bottom:8px">Datos de Inscripción</h3>
        <table style="border-collapse:collapse;width:100%">
          <tbody>${infoRows}</tbody>
        </table>

        ${isTeam && membersRows ? `
        <h3 style="border-bottom:2px solid #ea580c;padding-bottom:8px;margin-top:28px">Integrantes</h3>
        <table style="border-collapse:collapse;width:100%;font-size:13px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:left">#</th>
              <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:left">Nombre</th>
              <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:left">Email</th>
              <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:left">Género</th>
              <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:left">Talla</th>
            </tr>
          </thead>
          <tbody>${membersRows}</tbody>
        </table>` : ''}

        <p style="color:#9ca3af;font-size:13px;margin-top:32px">
          Para más información escríbenos a
          <a href="mailto:${cfg.organizerEmail}" style="color:#ea580c">${cfg.organizerEmail}</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6;padding:16px 32px;text-align:center;font-size:12px;color:#9ca3af">
        Travesía Rieles del Lago 2026 · Ecuador
      </div>
    </div>`;
}

const tdL = 'padding:8px 12px;border:1px solid #e5e7eb;width:40%';
const tdR = 'padding:8px 12px;border:1px solid #e5e7eb';

function organizerHtml(data) {
  const now = new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' });
  const tipo = data.type === 'team' ? 'Grupal' : 'Individual';
  const nombre = data.type === 'team' ? `${data.teamName} (rep: ${data.representativeName})` : data.fullName;
  const total = data.type === 'team' ? `$${(data.members?.length || 0) * 14}` : '$15';

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111">
      <div style="background:#111;padding:20px 24px">
        <h1 style="color:#ea580c;margin:0;font-size:18px;text-transform:uppercase;letter-spacing:2px">
          Nueva Inscripción
        </h1>
      </div>
      <div style="padding:24px">
        <table style="border-collapse:collapse;width:100%">
          <tbody>
            <tr><td style="${tdL}"><strong>Fecha/hora</strong></td><td style="${tdR}">${now}</td></tr>
            <tr><td style="${tdL}"><strong>Código</strong></td><td style="${tdR}"><strong style="font-size:18px;font-family:monospace;letter-spacing:3px">${data.confirmationCode}</strong></td></tr>
            <tr><td style="${tdL}"><strong>Tipo</strong></td><td style="${tdR}">${tipo}</td></tr>
            <tr><td style="${tdL}"><strong>Nombre / Equipo</strong></td><td style="${tdR}">${nombre}</td></tr>
            <tr><td style="${tdL}"><strong>Email</strong></td><td style="${tdR}">${data.email}</td></tr>
            <tr><td style="${tdL}"><strong>Teléfono</strong></td><td style="${tdR}">${data.phone}</td></tr>
            <tr><td style="${tdL}"><strong>Total cobrado</strong></td><td style="${tdR}"><strong>${total}</strong></td></tr>
          </tbody>
        </table>
        <p style="margin-top:20px;color:#555;font-size:13px">El comprobante de pago está adjunto a este correo.</p>
        <details style="margin-top:16px">
          <summary style="cursor:pointer;color:#9ca3af;font-size:12px">Ver datos completos (JSON)</summary>
          <pre style="background:#f3f4f6;padding:12px;font-size:11px;overflow:auto;margin-top:8px">${JSON.stringify({ ...data, paymentProof: '[adjunto]' }, null, 2)}</pre>
        </details>
      </div>
    </div>`;
}

// ── Route ─────────────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const data = req.body;
  if (!data || !data.type || !data.confirmationCode) {
    return res.status(400).json({ success: false, message: 'Datos incompletos.' });
  }

  const proof = parseProof(data.paymentProof);
  const attachments = proof
    ? [{ filename: `comprobante-${data.confirmationCode}.${proof.ext}`, content: proof.buffer, contentType: proof.mimeType }]
    : [];

  try {
    // Correo al participante
    await transporter.sendMail({
      from: cfg.from,
      to: data.email,
      subject: `Confirmación de Inscripción ${data.confirmationCode} – Travesía Rieles del Lago 2026`,
      html: participantHtml(data),
    });

    // Correo al organizador con comprobante adjunto
    await transporter.sendMail({
      from: cfg.from,
      to: cfg.organizerEmail,
      subject: `Nueva Inscripción ${data.confirmationCode} – ${data.type === 'team' ? data.teamName : data.fullName}`,
      html: organizerHtml(data),
      attachments,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error.message);
    res.status(500).json({ success: false, message: 'Error al enviar correos.' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = cfg.port || 3001;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
