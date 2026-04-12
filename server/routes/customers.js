import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    const test = new User({ name: 'Forge Collector', email: `test-${Date.now()}@qilzir.com`, role: 'customer' });
    await test.save();
    res.json({ message: 'Success! New collector established in Atlas cloud.', user: test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).sort({ totalSpent: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    // Return generic error for security (prevents user enumeration)
    res.status(400).json({ error: 'Identity verification failed. Please check your credentials.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
