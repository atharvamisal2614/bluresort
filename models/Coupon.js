import mongoose, { model } from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    
  },
  { timestamps: true }
);



export const Coupon = mongoose.models.Coupon ?? model("Coupon", CouponSchema);
