const { Monster, Image } = require("../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = class MonsterController {
  static async getAllMonster(req, res, next) {
    try {
      const data = await Monster.findAll({
        include: {
          model: Image,
        },
      });
      // console.log(data);
      res.status(200).json({ data: data, message: `success` });
    } catch (err) {
      console.log(err, "<<< err getAllMonster");
      next(err);
    }
  }

  static async getPerMonster(req, res, next) {
    const { id } = req.params;
    try {
      const data = await Monster.findByPk(id, {
        include: {
          model: Image,
        },
      });
      // console.log(data);
      if (!data) {
        next({
          name: "NotFound",
          message: `Monster with id:${id} is not found`,
        });
        return;
      }
      res.status(200).json({ data: data, message: `success` });
    } catch (err) {
      console.log(err, "<<< err getPerMonster");
      next(err);
    }
  }

  static async uploadImgById(req, res, next) {
    try {
      console.log(req.file);
      const monsterId = +req.params.id;
      const data = await Monster.findByPk(monsterId);
      if (!data) {
        next({
          name: "NotFound",
          message: `Monster with id:${monsterId} is not found`,
        });
        return;
      }
      const mimeType = req.file.mimetype;
      const base64Image = req.file.buffer.toString("base64");
      const result = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64Image}`,
        {
          folder: "indra",
          public_id: req.file.originalname,
        }
      );
      await data.update({ imgUrl: result.secure_url });
      res.json({
        message: `Image url on monster with id:${monsterId} has been updated`,
      });
    } catch (err) {
      console.log(err, "<<< err uploadImgById");
      next(err);
    }
  }
};
