import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  items: [
    {
      product: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  amount: {
    type: Number,
    required: true,
  },

  address: {
    type: Object,
    required: true,
  },

  status: {
    type: String,
    default: "Order placed",
  },

  date: {
    type: Number,
    required: true,
  },
});

const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
