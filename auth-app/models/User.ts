import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔐 Forgot password (OTP)
    resetCode: {
      type: String,
    },
    resetCodeExpiry: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
const User = models.User || model("User", UserSchema);

export default User;
