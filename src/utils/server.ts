import router from "../routes";
import deserializeUser from "../middlewares/deserializeUser";
import express from "express";
import cors from "cors";

export const getServer = () => {
  const app = express();

  app.use(express.json());
  app.use(deserializeUser);
  app.use(express.urlencoded({ extended: true }));

  app.use(cors());

  app.use(router);

  return app;
};
