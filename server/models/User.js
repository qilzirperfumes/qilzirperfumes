import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role:  { type: String, default: 'customer', enum: ['customer', 'admin'] },
  tier:  { type: String, default: 'Standard' },
  totalSpent: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
