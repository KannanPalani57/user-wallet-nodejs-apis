require("dotenv").config();
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import { getServer } from "./utils/server";

const port = config.get("port");

const app = getServer();

app.get("/", (req, res) => {
  res.send("NodeJS app is running!");
});

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);

  connectToDb();
});
