import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    trim:true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
},
{ timestamps: true }
);

export const User = mongoose.model("User", UserSchema); 