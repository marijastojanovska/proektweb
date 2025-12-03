const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const { sendMail } = require('../config/mailer');

const router = express.Router();

const SHOP_EMAIL = process.env.SHOP_EMAIL || process.env.MAIL_FROM || 'marijastojanovska319@gmail.com';

/**
 * Create new order
 * POST /api/orders
 */

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { items, shippingAddress } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const orderItems = [];
    let total = 0;

    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) {
        return res
          .status(400)
          .json({ message: `Product not found: ${it.product}` });
      }

      if (p.countInStock < it.qty) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${p.name}` });
      }

      const lineTotal = p.price * it.qty;
      total += lineTotal;

      orderItems.push({
        product: p._id,
        name: p.name,
        image: p.image,
        qty: it.qty,
        price: p.price,
        size: it.size,
        color: it.color,
      });

      p.countInStock -= it.qty;
      await p.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      shippingAddress,
    });

    // Build simple HTML summary
    const itemsHtml = order.items
      .map(
        (it) => `
        <li>
          ${it.name} — ${it.qty} x $${it.price.toFixed(2)}
          ${it.size ? `(size: ${it.size})` : ''}
          ${it.color ? `(color: ${it.color})` : ''}
        </li>
      `
      )
      .join('');

    const orderHtml = `
      <h2>Нова нарачка #${order._id}</h2>
      <p>Корисник: ${req.user.name} (${req.user.email})</p>
      <p>Вкупно: $${order.total.toFixed(2)}</p>
      <h3>Артикли:</h3>
      <ul>
        ${itemsHtml}
      </ul>
      <h3>Адреса за достава</h3>
      <p>
        ${shippingAddress?.fullName || ''}<br/>
        ${shippingAddress?.address || ''}<br/>
        ${shippingAddress?.postalCode || ''} ${shippingAddress?.city || ''}<br/>
        ${shippingAddress?.country || ''}
      </p>
    `;

    // 1) Email to shop / admin
    try {
      await sendMail({
        to: SHOP_EMAIL,
        subject: `Нова нарачка #${order._id}`,
        html: orderHtml,
      });
    } catch (err) {
      console.error('Failed to send order email to shop:', err);
    }

    // 2) Optional email to customer
    try {
      if (req.user?.email) {
        await sendMail({
          to: req.user.email,
          subject: `Вашата нарачка #${order._id} е примена`,
          html: `
            <p>Здраво ${req.user.name},</p>
            <p>Твојата нарачка #${order._id} е успешно примена.</p>
            <p>Вкупниот износ е $${order.total.toFixed(2)}.</p>
            <p>Ќе те контактираме за испорака.</p>
          `,
        });
      }
    } catch (err) {
      console.error('Failed to send order confirmation to customer:', err);
    }

    res.status(201).json(order);
  })
);

/**
 * Get my orders
 * GET /api/orders/my
 */
router.get(
  '/my',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  })
);

/**
 * Get all orders (admin)
 * GET /api/orders
 */
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  })
);

/**
 * Update order status (admin)
 * PATCH /api/orders/:id/status
 */
router.patch(
  '/:id/status',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status } = req.body || {};
    const allowed = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  })
);

module.exports = router;
