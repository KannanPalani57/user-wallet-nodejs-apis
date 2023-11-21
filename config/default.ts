export default {
  port: process.env.PORT || 8000,
  dbUri: "", // dbUri: "mongodb://localhost:27017/sirpiApp",
  logLevel: "info",
  accessTokenSecretKey: "random-string",
  refreshTokenSecretKey: "random-string",
};
