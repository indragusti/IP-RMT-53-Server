require("dotenv").config();

// const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const MonsterController = require("./controllers/MonsterController");
const UserController = require("./controllers/UserController");

// const authentication = require("./middlewares/authentication");
const { errorHandler } = require("./middlewares/errorHandler");

app.post("/login", UserController.login);
app.post("/register", UserController.register);

// app.use(authentication);
app.get("/monster", MonsterController.getAllMonster);
app.get("/monster/:id", MonsterController.getPerMonster);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
