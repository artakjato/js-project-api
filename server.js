import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import "dotenv/config";

import happyThoughtRoutes from "./routes/happyThoughtRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const password = process.env.PASSWORD;
const mongoDB =
  process.env.MONGO_URL ||
  `mongodb+srv://artakjato:${password}@clusterhappythoughts.fhtetam.mongodb.net/?appName=ClusterHappyThoughts`;
main().catch((err) => console.log(err));
async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoDB);
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  //listing all available endpoints
  const endpoints = expressListEndpoints(app);
  res.json({
    message: "Welcome to the Happy Thoughts API!",
    endpoints: endpoints,
  });
});

app.use("/api/thoughts", happyThoughtRoutes);
app.use("/api/users", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
