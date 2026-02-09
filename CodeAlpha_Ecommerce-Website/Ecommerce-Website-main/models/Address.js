import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    phoneNumber: {   // ✅ FIXED
      type: String,
      required: true,
    },

    pincode: {       // ✅ keep as String
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Address =
  mongoose.models.address || mongoose.model("Address", addressSchema);

export default Address;
