import TokenService from "../services/token.service.js";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async singup(req, res, next) {
    try {
      const { name, email, password, age, gender } = req.body;
      if (!req.file) {
        return res.status(400).send("Profile picture is required");
      }
      const profilePic = req.file.filename;

      // Validate the ORIGINAL password before hashing
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

      if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .send(
            "Password must be 8-20 characters with: 1 uppercase, 1 lowercase, 1 digit, and 1 special character (@$!%*?&)"
          );
      }
      const hasedPassword = await bcrypt.hash(password, 12);
      const newUser = new UserModel(
        name,
        email,
        hasedPassword,
        profilePic,
        age,
        gender
      );
      const result = await this.userRepository.signupRepo(newUser);
      const filteredUser = {
        name: result.name,
        age: result.age,
        gender: result.gender,
      };
      return res.status(200).send(filteredUser);
    } catch (err) {
      next(err);
    }
  }

  async singin(req, res, next) {
    try {
      const { email, password } = req.body;
      //find user by email
      const user = await this.userRepository.findUserByEmail(email);
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        return res.status(404).send("Incorect credentials");
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          tokenVersion: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );
      return res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const userId = req.params.userId;
      const user = await this.userRepository.getUserDetailsRepo(userId);
      const filterUser = {
        name: user.name,
        age: user.age,
        gender: user.gender,
      };
      return res.status(200).send(filterUser);
    } catch (err) {
      next(err);
    }
  }

  async getAllUser(req, res, next) {
    try {
      const users = await this.userRepository.getAllUsersRepo();
      return res.status(200).send(users);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const name = req.body.name;
      const email = req.body.email;
      const age = req.body.age;
      const gender = req.body.gender;

      const user = await this.userRepository.updateUserDataRepo(
        userId,
        name,
        email,
        age,
        gender
      );
      const filterUser = {
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
      };
      return res.status(200).send(filterUser);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(400).send("No token provided");
      }

      await TokenService.BlacklistToken(token);
      return res.status(200).send("User is logout successfully");
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(req, res, next) {
    try {
      const userId = req.userId;
      await this.userRepository.tokenVersionIncrement(userId);
      return res.status(200).send("Loged out from all device is successful");
    } catch (err) {
      next(err);
    }
  }
}
