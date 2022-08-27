const express = require("express");
const db = require('./config/connection');
const logger = require("morgan");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3001;


app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));



// routes
app.use(require("./routes/api.js"));

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
})