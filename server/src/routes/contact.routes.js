const express = require('express');
const asyncHandler = require('express-async-handler');
const { sendMail } = require('../config/mailer');

const router = express.Router();

const SHOP_EMAIL = process.env.SHOP_EMAIL || process.env.MAIL_FROM || 'marijastojanovska319@gmail.com';

/**
 * POST /api/contact
 * body: { name, email, message }
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: 'Име, e-mail и порака се задолжителни.' });
    }

    const html = `
      <h2>Нова порака од контакт форма</h2>
      <p><strong>Име:</strong> ${name}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Порака:</strong></p>
      <p>${String(message).replace(/\n/g, '<br/>')}</p>
    `;

    await sendMail({
      to: SHOP_EMAIL,
      subject: `Контакт форма од ${name}`,
      html,
    });

    res.json({ message: 'Пораката е испратена. Ви благодариме.' });
  })
);

module.exports = router;
