import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { authRouter } from "./routes/auth";
import { protect } from "./middlewares/protected";
import { searchRouter } from "./routes/search";
import { spamRouter } from "./routes/spam";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/spam", protect, spamRouter);
app.use("/search", protect, searchRouter);

app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(500).send('Something broke!'); // Send generic error message to client
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
