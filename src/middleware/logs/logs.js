import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-loging" },
  transports: [new winston.transports.File({ filename: "log.txt" })],
});

//Handle error
logger.on("error", (err) => {
  console.error("Looger error is: ", err.message);
});

export default logger;
