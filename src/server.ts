import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signin } from "./handlers/users";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200);
  res.json({ message: "hello" });
});

app.use("/api", protect, router);

app.use("/user", createNewUser);
app.use("/signin", signin);

app.use((err, req, res, next) => {
  switch (err.type) {
    case "auth":
      res.status(401).json({ msg: "unauthorized" });
      break;
    case "input":
      res.status(400).json({ msg: "invalid input" });
      break;
    default:
      res.status(500).json({ msg: "somthing went wrong on the server" });
  }
});

export default app;
