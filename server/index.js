require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = require("./src/app");
const { logger } = require("./Logs/logs");

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}!`);
});
