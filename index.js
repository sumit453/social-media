import "./env.js";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swagger from "swagger-ui-express"

import connectUsingMongoose from "./src/config/mongoose.config.js";
import userRoutes from "./src/features/users/user.routes.js";
import loggerMiddleware from "./src/middleware/logs/logs.middleware.js";
import errorHandlingMiddleware from "./src/middleware/errorHandling.middleware.js";
import postRoutes from "./src/features/post/post.routes.js";
import jwtAuth from "./src/middleware/jwtAuth.middleware.js";
import likeRoutes from "./src/features/like/like.routes.js";
import commentRoutes from "./src/features/comment/comments.routes.js";
import otpRouts from "./src/features/otp/otp.routs.js";
import friendsRouts from "./src/features/friends/friends.routes.js";
import apiDocs from "./swagger.json" with {type: "json"}

const server = express();

server.use(helmet());
server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
//server.use(bodyParser.json());
server.use(express.json());

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs))
server.use(loggerMiddleware);

server.use("/api/post", jwtAuth, postRoutes);
server.use("/api/likes", jwtAuth, likeRoutes);
server.use("api/comments", jwtAuth, commentRoutes);
server.use("/api/users", userRoutes);
server.use("/api/otp", otpRouts);
server.use("/api/friends", jwtAuth, friendsRouts);

server.get("/", (req, res) => {
  return res.status(200).send("It is an social media project API");
});

// error handling middleware
server.use(errorHandlingMiddleware);

// handling error code 404
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our docomentation for more information (http://localhost:3000/api-docs/)"
    );
});

server.listen(3000, () => {
  console.log("Server is listening on 3000");
  connectUsingMongoose();
});
