import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./router/route.js";
import connect from "./database/db.js";
import morgan from "morgan";
import timeout from "connect-timeout";

const port = process.env.PORT;
const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.static("uploads"));
app.use(cors());
app.use(morgan("tiny"));

app.use(timeout("20000"));
app.use((req, res, next) => {
  if (req.timedout) {
    return res.status(408).json({ error: "Request timed out" });
  }
  next();
});
app.disable("x-powered-by");
app.use("/api", router);
app.get("/", (req, res) => {
  res.status(201).send({ message: "Hello" });
});

connect()
  .then(() => {
    try {
      app.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server started at ${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => console.log(error));
