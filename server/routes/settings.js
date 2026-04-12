import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// Seed default settings
async function seedSettings() {
  const count = await Settings.countDocuments();
  if (count === 0) {
    await Settings.insertMany([
      { key: 'delivery_instructions', value: 'All orders are shipped within 2-3 business days. Free shipping on orders above ₹999.' },
      { key: 'cod_enabled', value: true },
      { key: 'cod_min_amount', value: 0 },
      { key: 'announcement', value: '' },
      { key: 'store_phone', value: '9789392728' },
      { key: 'store_email', value: 'support@qilzir.com' },
    ]);
    console.log('✓ Seeded default settings to MongoDB');
  }
}
seedSettings().catch(console.error);

// GET  /api/settings  — returns all as { key: value } object
router.get('/', async (req, res) => {
  try {
    const docs = await Settings.find();
    const result = {};
    docs.forEach(d => { result[d.key] = d.value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT  /api/settings/:key  — upsert a single setting
router.put('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    const doc = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { $set: { value } },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT  /api/settings  — bulk upsert
router.put('/', async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value } },
        upsert: true,
      },
    }));
    await Settings.bulkWrite(ops);
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
