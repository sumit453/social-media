import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import ApplicationError from "../../error-handeler/applicationError.js";
import blacklistSchema from "../../middleware/blacklisted.token.Schema.middleware.js";

const blackListTokenModel = mongoose.model("BlaklistToken", blacklistSchema);

export default class TokenService {
  static async BlacklistToken(token) {
    try {
      const decode = jwt.decode(token);

      if (!decode || !decode.exp) {
        throw new ApplicationError("Invalid token", 400);
      }

      const expiredAt = new Date(decode.exp * 1000); // convert expired hour to milliseconds by multyplying with 1000

      const blacklistToken = new blackListTokenModel({
        token: token,
        expiredAt: expiredAt,
      });

      await blacklistToken.save();
      return true;
    } catch (err) {
      console.error("Token blacklist error is: ", err.message);
      throw new ApplicationError("Failed to blacklist token", 500);
    }
  }

  static async isTokenBlacklisted(token) {
    try {
      const exists = await blackListTokenModel.findOne({ token: token });
      if (exists) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Token check error is: ", err.message);
      throw new ApplicationError("Token check faild", 500);
    }
  }
}
