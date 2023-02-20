const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

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


require("./user.js")
const user = mongoose.model("UserInfo")

app.use(express.json());

app.post("/register", async (req,res) => {

  const {username,password,email,experiencelvl} = req.body;
  try{
    await user.create({
      username,
      password,
      email,
      experiencelvl,
    })
    res.send({status: "ok"})

  }catch(error){
    console.log(error)
    res.send(error)
  }
})


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

// MONGODB API REQUESTS ///

app.post("/post", async (req, res) => {
  console.log(req.body);

  const { data } = req.body;

  try {
    if (data == "hello") {
      res.send({ status: "ok" });
    } else {
      res.send({ status: "user not found" });
    }
  } catch (error) {
    res.send(error);
  }
});

// 5. Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server listening on port ", port);
});
