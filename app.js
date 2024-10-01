const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const authentication = require("./middlewares/authentication");
const { guardAdmin } = require("./middlewares/authorization");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const MonsterController = require("./controllers/MonsterController");
const UserController = require("./controllers/UserController");
const UserFavController = require("./controllers/UserFavController");

app.post("/login", UserController.login);
app.post("/register", UserController.register);

app.use(authentication);

app.get("/monster", MonsterController.getAllMonster);
app.get("/monster/:id", MonsterController.getPerMonster);
app.patch(
  "/monster/:id/imgUrl",
  guardAdmin,
  upload.single("file"),
  MonsterController.uploadImgById
);

app.get("/favorites", UserFavController.getFavMonster);
app.post("/favorites", UserFavController.addFavMonster);
app.delete("/favorites/:monsterId", UserFavController.delFavMonster);

app.use(errorHandler);

module.exports = { app };
