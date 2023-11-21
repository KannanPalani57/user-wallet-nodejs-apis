import mongoose from "mongoose";
import config from "config";
import log from "./logger";

async function connectToDb() {
  const dbUri = config.get<string>("dbUri");

  try {
    mongoose.set("strictQuery", false);
    //mongodb://host1:port1/?replicaSet=rsName - for connecting mongodb replica set with single host
    await mongoose.connect(dbUri);
    log.info("Connected to DB");
  } catch (e) {
    process.exit(1);
  }
}

export default connectToDb;
