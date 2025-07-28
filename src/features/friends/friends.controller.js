import FriendRepository from "./friends.repository.js";

export default class FriendController {
  constructor() {
    this.friendRepository = new FriendRepository();
  }

  async sendFriendRequest(req, res, next) {
    try {
      const userId = req.userId;
      const reciverId = req.params.reciverId;
      await this.friendRepository.sendFrienRequestRepo(userId, reciverId);
      return res.status(200).send("Friend request is send");
    } catch (err) {
      next(err);
    }
  }

  async acceptFriendRequest(req, res, next) {
    try {
      const friendId = req.params.friendId;
      await this.friendRepository.acceptFriendRequistRepo(friendId);
      return res.status(200).send("Friend request is accepted");
    } catch (err) {
      next(err);
    }
  }

  async getAUserFriends(req, res, next) {
    try {
      const userId = req.params.userId;
      const friends = await this.friendRepository.getAUserFriendsRepo(userId);
      return res.status(200).send(friends);
    } catch (err) {
      next(err);
    }
  }

  async getPandingRequests(req, res, next) {
    try {
      const pandingRequests =
        await this.friendRepository.getPandingRequestsRepo();
      return res.status(200).send(pandingRequests);
    } catch (err) {
      next(err);
    }
  }

  async toogleFriendshipWithAnotherUser(req, res, next) {
    try {
      const friendId = req.params.friendId;
      const friends =
        await this.friendRepository.toogleFriendshipWithAnotherUserRepo(
          friendId
        );
      return res.status(200).send(friends);
    } catch (err) {
      next(err);
    }
  }
}
