import express from "express";
import FriendController from "./friends.controller.js";

const friendsRouts = express.Router();
const friendController = new FriendController();

friendsRouts.get("/get-friends/:userId", (req, res, next) => {
  friendController.getAUserFriends(req, res, next);
});

friendsRouts.get("/get-pending-requests", (req, res, next) => {
  friendController.getPandingRequests(req, res, next);
});

friendsRouts.get("/toggle-friendship/:friendId", (req, res, next) => {
  friendController.toogleFriendshipWithAnotherUser(req, res, next);
});

friendsRouts.post("response-to-request/:friendId", (req, res, next) => {
  friendController.acceptFriendRequest(req, res, next);
});

friendsRouts.post("/:reciverId", (req, res, next) => {
  friendController.sendFriendRequest(req, res, next);
});

export default friendsRouts;
