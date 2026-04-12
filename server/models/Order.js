import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId:      { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, required: true },
  items: [
    {
      product:   { type: String, required: true },
      name:      { type: String, required: true },
      price:     { type: Number, required: true },
      qty:       { type: Number, required: true },
    }
  ],
  total:        { type: Number, required: true },
  status:       { type: String, default: 'Pending' },
  paymentMethod:{ type: String, default: 'online' },
  paymentId:    { type: String, default: 'N/A' },
  address:      { type: String, default: '' },
}, { timestamps: true });


export default mongoose.model('Order', orderSchema);
