const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv");
const DEFOULT_PORT_NUMBER = 3008;
const PORT = process.env.PORT || DEFOULT_PORT_NUMBER;
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");
client.connect();
app.use(bodyParser.json());

app.get("/search", async (req, res) => {
  const db = client.db("engine");
  const page = db.collection("pages");
  const q = req.query.q;
  const data = await page.find({ terms: q }).toArray();
  res.status(200).json({ message: data });
});

function mySplit(str) {
  if (!str) {
    return [];
  }
  return str.split(" ");
};

app.post("/crawl", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  const db = client.db("engine");
  const page = db.collection("pages");
  let terms = mySplit(content);
  const insertedData = await page.insertOne({ title, terms });
  res.status(200).json({ message: "data inserted succesfuly" });
});


app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});
