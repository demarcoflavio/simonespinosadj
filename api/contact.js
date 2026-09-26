// api/contact.js
// Función serverless de Vercel. No requiere instalar dependencias:
// usa el fetch nativo de Node 18+ para llamar a la API de Resend.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, apellido, ciudad, telefono, correo, mensaje } = req.body || {};

  // Validación básica en el servidor (nunca confiar solo en el front)
  if (!nombre || !apellido || !ciudad || !telefono || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Mientras uses el dominio de prueba de Resend, el remitente
        // tiene que ser onboarding@resend.dev. Cuando verifiques tu
        // propio dominio, cambiá esto por algo como
        // "Simón Espinosa DJ <contacto@simonespinosadj.com>"
        from: 'Simón Espinosa DJ <onboarding@resend.dev>',
        to: ['demarcoflavio@gmail.com'],
        reply_to: correo,
        subject: `Nueva consulta de ${nombre} ${apellido} (${ciudad})`,
        html: `
          <h2>Nueva consulta desde la web</h2>
          <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
          <p><strong>Ciudad:</strong> ${ciudad}</p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          <p><strong>Correo:</strong> ${correo}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${(mensaje || '(sin mensaje)').replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!resendRes.ok) {
      const errData = await resendRes.json().catch(() => ({}));
      console.error('Error de Resend:', errData);
      return res.status(502).json({ error: 'No se pudo enviar el email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error en /api/contact:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}