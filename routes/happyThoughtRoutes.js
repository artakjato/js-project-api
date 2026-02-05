import express from "express";
import mongoose from "mongoose";
import { HappyThoughts } from "../models/happyThought.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = {};

  if (req.query.minHearts) {
    const minHearts = Number(req.query.minHearts);
    if (Number.isNaN(minHearts)) {
      return res.status(400).json({ error: "minHearts must be a number" });
    } 
    query.hearts = { $gte: minHearts };
  }

    const thoughts = await HappyThoughts.find(query).sort({ createdAt: -1 });//greater than or equal to
    return res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" }); // will check if the id is valid
  }
  try {
    const thought = await HappyThoughts.findById(id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    return res.json(thought);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticateUser, async (req, res) => {
  const { message } = req.body;
  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({
      error: "Message is required and must be between 5 and 140 characters", // will validate the message length or if it's empty
    });
  } try {
  const newThought = await HappyThoughts.create({
   message,
   userId: req.user.id,
    });
    return res.status(201).json(newThought);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticateUser,async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({
      error: "Message is required and must be between 5 and 140 characters",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const thought = await HappyThoughts.findById(id)
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    if (thought.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to update this thought" });
    }

    thought.message = message;
    await thought.save();

    return res.json(thought);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const thought = await HappyThoughts.findById(id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    if (thought.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to delete this thought" });
    }
    await HappyThoughts.findByIdAndDelete(id);
    return res.json({ message: "Thought deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/:id/like", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const thought = await HappyThoughts.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    return res.json(thought);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;