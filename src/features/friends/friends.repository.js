import mongoose from "mongoose";
import friendsSchema from "./friends.schema.js";
import ApplicationError from "../../error-handeler/applicationError.js";
import userSchema from "../users/user.schema.js";
import { ObjectId } from "mongodb";

const friendsModel = mongoose.model("Friend", friendsSchema);
const userModel = mongoose.model("User", userSchema);

export default class FriendRepository {
  async sendFrienRequestRepo(userId, reciverId) {
    try {
      const sender = await userModel.findById(new ObjectId(userId));
      if (!sender) {
        throw new ApplicationError("User is not found", 404);
      }
      const reciver = await userModel.findById(new ObjectId(reciverId));
      if (!reciver) {
        throw new ApplicationError("Reciver is not found", 404);
      }
      const friendRequest = new friendsModel({
        sender: new ObjectId(sender._id),
        senderEmail: sender.email,
        reciver: new ObjectId(reciver._id),
        reciverEmail: reciver.email,
      });
      const saveFriendRequest = await friendRequest.save();
      sender.friendRequestSend.push(new ObjectId(saveFriendRequest._id));
      reciver.friendRequestRecived.push(new ObjectId(saveFriendRequest._id));
      await sender.save();
      await reciver.save();
    } catch (err) {
      console.error("Friend request send error is: ", err.message);
      throw new ApplicationError("Friend request send is Failed", 500);
    }
  }

  async acceptFriendRequistRepo(friendId) {
    try {
      const friendRequest = await friendsModel.findById(new ObjectId(friendId));
      if (!friendRequest) {
        throw new ApplicationError("Friend request is not found", 404);
      }
      await userModel.findByIdAndUpdate(
        new ObjectId(friendRequest.reciver),
        {
          $push: { friends: new ObjectId(friendRequest.sender) },
          $pull: { friendRequestRecived: new ObjectId(friendId) },
        },
        { new: true }
      );
      await userModel.findByIdAndUpdate(
        new ObjectId(friendRequest.sender),
        {
          $push: { friends: new ObjectId(friendRequest.reciver) },
          $pull: { friendRequestSend: new ObjectId(friendId) },
        },
        { new: true }
      );
      friendRequest.status = "Accept";
      await friendRequest.save();
    } catch (err) {
      console.error("Friend requist accept error is: ", err.message);
      throw new ApplicationError("Friend request accept is failed", 500);
    }
  }

  async getAUserFriendsRepo(userId) {
    try {
      const user = await userModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      const allFriends = [];
      user.friends.map(async (friend) => {
        const frienddata = await userModel.findById(new ObjectId(friend));
        allFriends.push({
          name: frienddata.name,
          email: frienddata.email,
          age: frienddata.age,
          gender: frienddata.gender,
        });
      });
      return allFriends;
    } catch (err) {
      console.error("Get a user friend requests error is: ", err.message);
      throw new ApplicationError(
        "Getting all friend request of an user is failed",
        500
      );
    }
  }

  async getPandingRequestsRepo() {
    try {
      const pandingRequests = await friendsModel.find({ status: "Panding" });
      if (!pandingRequests || pandingRequests.length == 0) {
        throw new ApplicationError(
          "There is no any panding friend request",
          404
        );
      }
      return pandingRequests;
    } catch (err) {
      console.error("Geting panding requests error is: ", err.message);
      throw new ApplicationError(
        "Getting all panding friend requests are failed",
        500
      );
    }
  }

  async toogleFriendshipWithAnotherUserRepo(friendId) {
    try {
      const friend = await userModel.findById(new ObjectId(friendId));
      if (!friend) {
        throw new ApplicationError("Friend is not found", 404);
      }
      const allFriend = [];
      friend.friends.map(async (f) => {
        const fdata = await userModel.findById(new ObjectId(f));
        allFriend.push({
          name: fdata.name,
          email: fdata.email,
          age: fdata.age,
          gender: fdata.gender,
        });
      });
      return allFriend;
    } catch (err) {
      console.error("Toogle othre's friends error is: ", err.message);
      throw new ApplicationError("Toogling is failed", 500);
    }
  }
}
