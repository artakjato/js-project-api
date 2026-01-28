import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import data from "./data.json";
import mongoose from 'mongoose';

const mongoDB = "mongodb://localhost:27017/happythoughts";
main().catch((err) => console.log(err));
async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoDB);
}

const Schema = mongoose.Schema;

const HappyThoughtsSchema = new Schema({
  // _id: String,
  message: String,
  hearts: Number,
  createdAt: String,
  __v: Number
});

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {   //listing all available endpoints
  const endpoints = expressListEndpoints(app);
  res.json({
    message: "Welcome to the Thoughts API!",
    endpoints: endpoints, 
    });
  });

app.get("/api/thoughts", async (req, res) => {
  if (req.query.minHearts) {
    const minHearts = parseInt(req.query.minHearts);
    const filteredThoughts = await HappyThoughts.find({ hearts: { $gte: minHearts } }); //greater than or equal to
    return res.json(filteredThoughts);
  }
   try {
    const thoughts = await HappyThoughts.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/thoughts/:id", (req, res) => {
  const id = req.params.id;
  const thought = data.find((thought) => thought._id === id);
  res.json(thought);
});

app.post("/api/thoughts", (req, res) => {
  const body = req.body;
  const newThought = {
    _id: String(data.length + 1),
    message: body.message,
    hearts: 0,
    createdAt: new Date().toISOString(),
    "__v": 0
  };
  data.push(newThought);
  res.status(201).json(newThought);
})
;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
