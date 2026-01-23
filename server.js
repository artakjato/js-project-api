import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import data from "./data.json";

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

app.get("/api/thoughts", (req, res) => {
  if (req.query.minHearts) {
    const minHearts = parseInt(req.query.minHearts);
    const filteredThoughts = data.filter(
      (thought) => thought.hearts >= minHearts,
    );
    return res.json(filteredThoughts);
  }
  res.json(data);
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
