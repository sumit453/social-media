import jwt from "jsonwebtoken";
import TokenService from "../features/services/token.service.js";
import UserRepository from "../features/users/user.repository.js";

const userRepository = new UserRepository();

const jwtAuth = async (req, res, next) => {
  //1. check the header for token
  const token = req.headers["authorization"];

  //2. If there is no tocken then throw error
  if (!token) {
    return res.status(401).send("Unauthorize");
  }

  //3. check for token validation
  try {
    // check the token is blacklisted or not
    const blackListed = await TokenService.isTokenBlacklisted(token);
    if (blackListed) {
      return res.status(401).send("Token is invalid");
    }

    //varify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // check token validation against database
    const user = await userRepository.getUserDetailsRepo(payload.userId);

    if (payload.tokenVersion !== user.tokenVersion) {
      return res.status(401).send("Token is invalidate please login again");
    }

    req.userId = payload.userId;
    console.log(payload);
  } catch (err) {
    console.error("jwtAuth error is: ", err.message);
    return res.status(401).send("Something is wrong with jwtAuth");
  }
  next();
};

export default jwtAuth;
