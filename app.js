require("dotenv").config();

// const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
