const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const products = require('./products.json');
const Post = require('../models/Post');

dotenv.config();

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing');
    await mongoose.connect(uri);
    console.log('Connected');
    await Product.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(products);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@shop.test',
      password: 'Admin123!',
      isAdmin: true,
    });

    // Add demo posts
const Post = require('../models/Post');
await Post.deleteMany({});
await Post.create([
  {
    title: 'НОВО во Tee-Shop! Очила за сонце',
    slug: 'dobredojdovte-vo-tee-shop-pro',
    excerpt: 'Почнувајќи од понеделник 08.12.2025 во нашата онлајн продавница ќе бидат досапни очила за сонце',
    body: 'Нашата нова колекција е тука! Проверете ги најновите производи и попусти.',
    image: 'https://www.louisvuitton.com/images/is/image/lv/MEN_BC_18_SUNGLASSES_ICONS_LVCOM_DII.jpg?wid=2400',
    tags: ['новости', 'колекција']
  },
  {
    title: 'Попуст викенд: -20% на селектирани производи',
    slug: 'popust-vikend-20-procenti',
    excerpt: 'Само овој викенд – искористете одлични попусти.',
    body: 'Од петок до недела имаме специјални попусти на маици, патики и шорцеви.',
    image: 'https://neven.rs/wp-content/uploads/2014/12/20.gif',
    tags: ['попуст', 'акција']
  },
  {
    title: 'НОВО во Tee-Shop!',
    slug: 'popust-vikend-30-procenti',
    excerpt: 'Почнувајќи од 15.12.2025 во нашата онлајн продавница ќе бидат досапни спортски елеци',
    body: 'Од петок до недела имаме специјални попусти на маици, патики и шорцеви.',
    image: 'https://images.footlocker.com/is/image/FLEU/317451651480?wid=250&hei=250',
    tags: ['новости', 'колекција']
  }
]);

    console.log('Seeded products and admin user:');
    console.log({ adminEmail: admin.email, adminPassword: 'Admin123!' });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();