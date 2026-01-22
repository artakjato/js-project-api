import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import data from "./data.json";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(expressListEndpoints(app)); // List all available endpoints
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
