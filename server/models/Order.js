import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId:      { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail:{ type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      name:      { type: String, required: true },
      price:     { type: Number, required: true },
      qty:       { type: Number, required: true },
    }
  ],
  total:        { type: Number, required: true },
  status:       { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  paymentType:  { type: String, default: 'COD' },
  address:      { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
