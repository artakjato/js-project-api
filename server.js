import cors from "cors"
import express from "express"
import { readFile } from 'fs/promises';
import thoughtsData from './data.json' with { type: "json" };
//import fs from 'fs';
import { get } from "http";

const port = process.env.PORT || 8080;
const app = express()

async function getThoughts() {
  const data = await readFile("./data.json");
  return JSON.parse(data);
}

app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!")
})

app.get("/api/thoughts", async(req, res) => {
  const thoughts = await getThoughts();
  res.json(thoughts);
})

app.get("/api/thoughts/:id", async(req, res) => {
  const thoughts = await getThoughts();
  const id = req.params.id;  
  const thought = thoughts.find(thought => thought._id === id);
  res.json(thought);
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
