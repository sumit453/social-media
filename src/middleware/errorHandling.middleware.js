import logger from "./logs/logs.js";
import ApplicationError from "../error-handeler/applicationError.js";
import mongoose from "mongoose";

const logError = (err, req) => {
  // check for sensitive url
  const sensitiveUrl = req.url.includes("singin") || req.url.includes("signup");
  const timestamp = new Date().toISOString();
  const errDetails = {
    message: `Error: ${req.method} ${req.url} - ${timestamp} - ${err.message}`,
    stack: err.stack,
    ...(!sensitiveUrl && { body: req.body || {} }),
  };
  logger.error(errDetails);
};

const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err) return next();

  // log all error with original message
  logError(err, req);

  // handling mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }

  // handling application error
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  console.error("The error is: ", err.message);
  return res.status(500).send("Something went wrong, please try again later");
};

export default errorHandlingMiddleware;
