const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middleware/error');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

if (process.env.NODE_ENV === 'development') {
  app.set('etag', false);
  app.use((req,res,next)=>{ res.set('Cache-Control','no-store'); next(); });
}

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: false,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.get('/api', (req, res) => res.json({ service: 'tee-shop-pro', version: '1.0.0' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/posts', require('./routes/post.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
