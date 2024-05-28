const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Router = require("./routes/route.js");
const app = express();
mongoose
  .connect("mongodb+srv://kuladeep:kuladeep@cluster0.zszg4r7.mongodb.net/")
  .then(() => console.log("DB connected"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/", Router);

app.listen(5000, () => {
  console.log("server is running on port 5000...");
});
