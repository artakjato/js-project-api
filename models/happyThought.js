import mongoose, { Schema } from "mongoose";

const Schema = mongoose.Schema;

const HappyThoughtsSchema = new Schema({
  _id: String,
  message: String,
  hearts: Number,
  createdAt: String,
  __v: Number,
});

export const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);
