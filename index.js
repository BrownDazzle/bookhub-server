const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan")
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const mobileApis = require("./routes/mobiles")
const ChatRoute = require("./routes/ChatController")
const MessageRoute = require("./routes/MessageController")
const cors = require("cors");


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(morgan("common"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/books", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/payment", mobileApis);
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)

const Port = 8000
app.listen(process.env.PORT || Port, () => {
  console.log(`Backend server is running on PORT ${Port}!`);
});
