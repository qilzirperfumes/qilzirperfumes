import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  sku:         { type: String, default: '' },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  originalPrice:{ type: Number },
  stock:       { type: Number, default: 0 },
  sales:       { type: Number, default: 0 },
  category:    { type: String, default: 'oud' },
  image:       { type: String, default: '/silk_amber_attar.png' },
  extraImages: { type: [String], default: [] },
  videoUrl:    { type: String, default: '' },
  collection:  { type: String, default: 'Signature' },
  type:        { type: String, default: 'Pure Attar' },
  notes: {
    top:   { type: String, default: '' },
    heart: { type: String, default: '' },
    base:  { type: String, default: '' },
  },
  tag:         { type: String, default: '' },
  isNewArrival:{ type: Boolean, default: false },
  description: { type: String, default: '' },
  size:        { type: Number, default: 100 },
  unit:        { type: String, default: 'ml' },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
