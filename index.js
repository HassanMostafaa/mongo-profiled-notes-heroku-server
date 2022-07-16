const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config();
const usersRoutes = require("./routes/UserRoutes");
const port = process.env.PORT || 3000;
const dbStr = process.env.MONGODB_CONNECTION_STRING;
const dbConnectionOptions = {
  dbName: `MongoDBProfiledNotes`,
  useUnifiedTopology: true,
};

const app = express();
const cors = require("cors");
const corsOpts = {
  origin: ["https://mongo-profiled-notes.vercel.app","http://localhost:3000/"],
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(express.json());

//app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: dbStr,
      dbName: `MongoDBProfiledNotes`,
      //collection: "active_sessions",
    }),
    cookie: {
      // 1000ms * 60sec * 60min * 24hr = 1day
      httpOnly:false,
      maxAge: 1000 * 60 * 60 * 24 * 15, // 2 weeks
    },
  })
);

//routes
app.use("/api/users", usersRoutes);

mongoose
  .connect(dbStr, dbConnectionOptions)
  .then(() => {
    console.log("DB CONNECTED");
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("mongoose connect error : ", error));
