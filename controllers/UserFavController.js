const { UserFavorite, Monster, User } = require("../models");

module.exports = class UserFavController {
  static async getFavMonster(req, res, next) {
    const { id } = req.user;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        next({ name: "NotFound", message: `User with id:${id} is not found` });
        return;
      }

      const favorites = await UserFavorite.findAll({
        where: { userId: id },
        include: { model: Monster },
      });

      res.status(200).json({ data: favorites, message: `success` });
    } catch (err) {
      console.log(err, "<<< err getFavMonster");
      next(err);
    }
  }

  static async addFavMonster(req, res, next) {
    const { id } = req.user;
    const { monsterId } = req.body;

    try {
      const user = await User.findByPk(id);
      console.log("userId:", user);
      if (!user) {
        next({ name: "NotFound", message: `User with id:${id} is not found` });
        return;
      }

      const monster = await Monster.findByPk(monsterId);
      console.log("monsterId:", monster);
      if (!monster) {
        next({
          name: "NotFound",
          message: `Monster with id:${monsterId} is not found`,
        });
        return;
      }

      const existingFavorite = await UserFavorite.findOne({
        where: { userId: id, monsterId },
      });
      if (existingFavorite) {
        return res.status(400).json({
          message: `This monster with id:${monsterId} is already in your favorites`,
        });
      }

      console.log();

      await UserFavorite.create(
        { userId: id, monsterId }
        // include: { model: Monster },
      );
      res.status(201).json({
        message: `Monster with id:${monsterId} has been successfully added to favorites`,
      });
    } catch (err) {
      console.log(err, "<<< err addFavMonster");
      next(err);
    }
  }

  static async delFavMonster(req, res, next) {
    const { id } = req.user;
    const monsterId = req.params.monsterId;

    try {
      const user = await User.findByPk(id);
      const monster = await Monster.findByPk(monsterId);
      if (!user) {
        next({ name: "NotFound", message: `User with id:${id} is not found` });
        return;
      }
      if (!monster) {
        next({
          name: "NotFound",
          message: `Monster with id:${id} is not found`,
        });
        return;
      }

      const result = await UserFavorite.destroy({
        where: {
          userId: id,
          monsterId,
        },
      });
      if (result === 0) {
        return next({
          name: "NotFound",
          message: `Monster with id:${monsterId} is not in your favorite list`,
        });
      }
      res.status(200).json({
        message: `Monster with id:${monsterId} successfully removed from favorites`,
      });
    } catch (err) {
      console.log(err, "<<< err delFavMonster");
      next(err);
    }
  }
};
