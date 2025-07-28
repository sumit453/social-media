import PostRepository from "./post.repository.js";
import PostModel from "./post.model.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  async craetePost(req, res, next) {
    try {
      const { caption, content } = req.body;
      let imageUrl;
      if (req.file) {
        imageUrl = req.file.filename;
      }
      const userId = req.userId;

      const newpost = new PostModel(caption, userId, content, imageUrl);

      const post = await this.postRepository.addPostRepo(newpost, userId);
      const result = { ...post.toObject(), date: this.formateDate(post.date) };
      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async getAllPost(req, res, next) {
    try {
      const userId = req.userId;
      const allpost = await this.postRepository.getAllPostRepo(userId);
      const result = allpost.map((post) => ({
        ...post.toObject(),
        date: this.formateDate(post.date),
      }));

      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async findOnePost(req, res, next) {
    try {
      const postId = req.params.postId;
      const userId = req.userId;
      const post = await this.postRepository.findOnePostRepo(postId, userId);
      const result = { ...post.toObject(), date: this.formateDate(post.date) };
      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async filterPost(req, res, next) {
    try {
      const { startDate, endDate } = req.body;
      const userId = req.userId;

      if (!startDate && !endDate) {
        return res.status(400).send("Atlest one date should be given");
      }

      const posts = await this.postRepository.filterPostRepo(
        startDate,
        endDate,
        userId
      );

      // Formate date for response
      const formatteddate = posts.map((post) => ({
        ...post.toObject(),
        date: this.formateDate(post.date),
      }));
      return res.status(200).send(formatteddate);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const userId = req.userId;
      const postId = req.params.postId;
      const result = await this.postRepository.deletePostRepo(postId, userId);
      if (!result) {
        return res.status(404).send("Post is not found");
      }
      return res.status(200).send("Product is deleted");
    } catch (err) {
      next(err);
    }
  }

  async editPost(req, res, next) {
    try {
      const { caption, content, imageUrl } = req.body;
      const userId = req.userId;
      const postId = req.params.postId;
      await this.postRepository.editPostRepo(
        postId,
        userId,
        caption,
        content,
        imageUrl
      );
      return res.status(200).send("Post is updated");
    } catch (err) {
      next(err);
    }
  }

  async getAllUserPost(req, res, next) {
    try {
      const posts = await this.postRepository.getAllPostFromAllUserRepo();
      const update = posts.map((post) => ({
        ...post.toObject(),
        date: this.formateDate(post.date),
      }));
      return res.status(200).send(update);
    } catch (err) {
      next(err);
    }
  }

  // helper function for formating date
  formateDate(date) {
    // 1. Get day of month (1-31) and format as 2-digit string
    const day = String(date.getDate()).padStart(2, "0");
    // 2. Get month (0-11) → convert to 1-12 and format as 2-digit string
    const month = String(date.getMonth() + 1).padStart(2, "0");
    // 3. Get full year (4 digits)
    const year = date.getFullYear();

    const result = `${day}/${month}/${year}`;
    return result;
  }
}
