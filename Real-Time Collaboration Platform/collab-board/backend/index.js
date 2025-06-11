import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server } from 'socket.io';
import Document from './models/Document.js';
import { applyCRDT } from './crdt.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ Connected to MongoDB");
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get("/documents/:id", async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).send("Doc not found");
  res.json(doc);
});

io.on("connection", (socket) => {
  socket.on("join", (docId) => {
    socket.join(docId);
  });

  socket.on("edit", async ({ docId, newContent }) => {
    const doc = await Document.findById(docId);
    if (!doc) return;

    doc.content = applyCRDT(doc.content, newContent);
    await doc.save();

    socket.to(docId).emit("update", doc.content);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
