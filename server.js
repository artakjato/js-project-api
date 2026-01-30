import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import "dotenv/config";

//const mongoDB = "mongodb://localhost:27017/happythoughts";
const password = process.env.PASSWORD;
const mongoDB =
  process.env.MONGO_URL ||
  `mongodb+srv://artakjato:${password}@clusterhappythoughts.fhtetam.mongodb.net/?appName=ClusterHappyThoughts`;
main().catch((err) => console.log(err));
async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoDB);
}

const Schema = mongoose.Schema;

const HappyThoughtsSchema = new Schema({
  _id: String,
  message: String,
  hearts: Number,
  createdAt: String,
  __v: Number,
});

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  //listing all available endpoints
  const endpoints = expressListEndpoints(app);
  res.json({
    message: "Welcome to the Thoughts API!",
    endpoints: endpoints,
  });
});

app.get("/api/thoughts", async (req, res) => {
  if (req.query.minHearts) {
    const minHearts = parseInt(req.query.minHearts);
    const filteredThoughts = await HappyThoughts.find({
      hearts: { $gte: minHearts },
    }); //greater than or equal to
    return res.json(filteredThoughts);
  }
  try {
    const thoughts = await HappyThoughts.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/thoughts/:id", async (req, res) => {
  const id = req.params.id;
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

app.post("/api/thoughts", async (req, res) => {
  const body = req.body;
  if (!body.message || body.message.length < 5 || body.message.length > 140) {
    return res.status(400).json({
      error: "Message is required and must be between 5 and 140 characters", // will validate the message length or if it's empty
    });
  }
  const newThought = {
    _id: new mongoose.Types.ObjectId().toString(),
    message: body.message,
    hearts: 0,
    createdAt: new Date().toISOString(),
    __v: 0,
  };
  await HappyThoughts.create(newThought);
  // data.push(newThought);
  res.status(201).json(newThought);
});

app.put("/api/thoughts/:id", async (req, res) => {
  const id = req.params.id;
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
    const thought = await HappyThoughts.findByIdAndUpdate(
      id,
      { $set: { message: message } },
      { new: true },
    );
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    return res.json(thought);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/thoughts/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const thought = await HappyThoughts.findByIdAndDelete(id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    return res.json({ message: "Thought deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/thoughts/:id/like", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const thought = await HappyThoughts.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } }
    );
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    return res.json(thought);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
