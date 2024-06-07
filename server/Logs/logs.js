const pino = require("pino");
require("dotenv").config();

const fileTransport = pino.transport({
  targets: [
    {
      target: "pino/file",
    },
    {
      target: "pino-pretty",
      options: { destination: `${process.env.LOG_PATH}/app.log` },
    },
  ],
  options: {
    destination: `${process.env.LOG_PATH}/app.log`,
    colorize: true,
    destination: 1,
  },
});

const logger = pino(fileTransport);

module.exports = { logger };
