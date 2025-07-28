import LikeRepository from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async addLike(req, res, next) {
    try {
      const userId = req.userId;
      const id = req.params.id;
      await this.likeRepository.addLikeRepo(userId, id);
      return res.status(200).send("Like is added");
    } catch (err) {
      next(err);
    }
  }

  async removeLike(req, res, next) {
    try {
      const likeId = req.params.likeId;
      await this.likeRepository.removeLikeRepo(likeId);
      return res.status(200).send("Like is removed");
    } catch (err) {
      next(err);
    }
  }

  async getLikeForAPostOrComment(req, res, next) {
    try {
      const id = req.params.id;
      const likeData = await this.likeRepository.getLikeForAPostOrCommentRepo(
        id
      );
      return res.status(200).send(likeData);
    } catch (err) {
      next(err);
    }
  }
}
