import logger from "./logs.js";

const loggerMiddleware = async (req, res, next) => {
  const sensitiveURL = req.url.includes("signin") || req.url.includes("signup");
  logger.info({
    url: req.url,
    timestamp: new Date().toString(),
    ...(!sensitiveURL && { body: req.body || {} }),
  });
  next();
};

export default loggerMiddleware;
