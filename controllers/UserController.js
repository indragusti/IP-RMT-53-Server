const { User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

module.exports = class UserController {
  static async login(req, res, next) {
    const { email, password } = req.body;
    if (!email) {
      next({ name: "BadRequest", message: "Email is required" });
      return;
    }
    if (!password) {
      next({ name: "BadRequest", message: "Password is required" });
      return;
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !passwd) {
        next({ name: "Unauthorized", message: "Invalid email/password" });
        return;
      }
      const access_token = signToken({ id: user.id });
      res.status(200).json({
        access_token,
        userId: user.id,
      });
    } catch (err) {
      console.log(err, "<<< err login");
      next(err);
    }
  }

  static async register(req, res, next) {
    const { username, email, password, role } = req.body;
    try {
      const user = await User.create({
        username,
        email,
        password,
        role: "user",
      });
      res.status(201).json({
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      console.log(err, "<<< err register");
      next(err);
    }
  }
};
