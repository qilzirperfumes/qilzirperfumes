import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Seed initial products if DB is empty
async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const seeds = [
      {
        id: 'silk-amber',
        sku: 'QZ-001',
        name: 'Silk Amber',
        price: 24000,
        stock: 12,
        sales: 45,
        category: 'musk',
        image: '/silk_amber_attar.png',
        tag: 'Best Seller',
        isNewArrival: false,
        description: 'A masterclass in modern perfumery. Silk Amber weaves rich Omani frankincense with creamy Madagascar vanilla and warm spices.',
      },
      {
        id: 'royal-oud',
        sku: 'QZ-002',
        name: 'Royal Oud',
        price: 35000,
        stock: 3,
        sales: 89,
        category: 'oud',
        image: '/hero_luxury_fragrance.png',
        tag: 'Limited',
        isNewArrival: true,
        description: 'A majestic blend of aged Cambodian oud, saffron, and rose absolute.',
      },
      {
        id: 'midnight-musk',
        sku: 'QZ-003',
        name: 'Midnight Musk',
        price: 18500,
        stock: 0,
        sales: 112,
        category: 'musk',
        image: '/silk_amber_attar.png',
        tag: '',
        isNewArrival: false,
        description: 'A sensual, skin-close musk that deepens throughout the day.',
      },
      {
        id: 'desert-rose',
        sku: 'QZ-004',
        name: 'Desert Rose',
        price: 22000,
        stock: 45,
        sales: 23,
        category: 'floral',
        image: '/hero_luxury_fragrance.png',
        tag: '',
        isNewArrival: true,
        description: 'A rare Taif rose sourced at dawn, blended with oud and sandalwood.',
      },
    ];
    await Product.insertMany(seeds);
    console.log('✓ Seeded initial products to MongoDB');
  }
}

seedIfEmpty().catch(console.error);

// GET  /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const id = data.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const product = new Product({
      ...data,
      id,
      tag: data.isNewArrival ? 'New Arrival' : (data.tag || ''),
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT  /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.isNewArrival !== undefined) {
      updates.tag = updates.isNewArrival ? 'New Arrival' : (updates.tag || '');
    }
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
