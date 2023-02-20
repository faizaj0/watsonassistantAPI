const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // JSON Web Token

// Secret key for signing and verifying JSON Web Tokens
const JWT_SECRET =
  'wsrakfjhias:dgjsan@@!£!£"!£!"@£"@%"^"$"wsfsdflkwnsbdfgwjakgsnv';

app.use(cors());

require("dotenv").config();

///// CONNECTING MONGO DATABASE /////
const mongoURL =
  "mongodb+srv://nfqn37:Faiza2206@cluster0.wj87fz7.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to the database");
  })
  .catch((e) => console.log(e));

require("./user.js");
const user = mongoose.model("UserInfo");

app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, password, email, experiencelvl } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const oldUser = await user.findOne({ username });

    if (oldUser) {
      return res.send({
        error: "Username already exists, please choose a different username",
      });
    }
    await user.create({
      username,
      password: hashedPassword,
      email,
      experiencelvl,
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const loggedInUser = await user.findOne({ username });
  if (!loggedInUser) {
    return res.send({ error: "User not found" });
  }
  if (await bcrypt.compare(password, loggedInUser.password)) {
    const token = jwt.sign({ username: loggedInUser.username }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.send({ error: "error" });
    }
  }
  return res.json({ error: "Incorrect username or password." });
});

app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    const foundUser = jwt.verify(token, JWT_SECRET);
    console.log(foundUser)
    const username = foundUser.username;
    user.findOne({ username: username })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        console.log(error);
        res.send({ error: "error", data: "error" });
      });
  } catch (error) {
    console.log(error);
    res.send({ error: "error", data: "error" });
  }
});
///////////////////////////////////////////////////////////////////////////////////

// 1. Allow parsing on request bodies
app.use(express.json());

// 2. Enable CORS
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.options("*", cors(corsOptions));

// 3. Import routes for api
const watsonRoutes = require("./routes/api/watson");

// 4. Direct requests to /api/watson to Watson Routes
app.use("/api/watson", watsonRoutes);

// 5. Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server listening on port ", port);
});
