import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    //role: 1-admin, 2-user
    role: {
      type: Number,
      default: 2,
    },
    verificationCode: {
      type: String,
    },
    forgotPasswordCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  },

  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
