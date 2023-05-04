const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const multer = require("multer");
const { memoryStorage } = multer;
const storage = memoryStorage();
const fs = require("fs");
require("dotenv").config();

const upload = new multer({ storage });


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET
});
const uploadImage = (title, emerginacts, imgFile) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: title,
      Bucket: emerginacts,
      Body: imgFile,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
      ACL: "public-read"
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

//ADMIN LOGIN
router.post("/admin-register", async (req, res) => {
  const imgFile = Buffer.from(req.body.profilePic, "binary");
  const emerginacts = process.env.AWS_BUCKET;
  const title = req.body.firstname

  const imgLink = await uploadImage(title, emerginacts, imgFile)

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    avatar: imgLink,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: req.body.isAdmin
  });

  try {
    const user = await newUser.save();
    console.log(user)
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.post("/admin-login", async (req, res) => {

  const user = await User.findOne({ email: req.body.email });
  !user && res.status(401).json("Wrong credentials!");


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: req.body.isAdmin
  });

  try {
    const savedUser = await newUser.save();
    console.log(savedUser)
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//REGISTER
router.post("/register", async (req, res) => {
  console.log(req.body)
  const imgFile = Buffer.from(req.body.profilePic, "binary");
  const emerginacts = process.env.AWS_BUCKET;
  const title = req.body.firstname

  const imgLink = await uploadImage(title, emerginacts, imgFile)

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    avatar: imgLink,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: req.body.isAdmin
  });

  try {
    const user = await newUser.save();
    console.log(user)
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong credentials!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const OriginalPassword = await bcrypt.compare(req.body.password, user.password);
    !OriginalPassword && res.status(400).json("Provide valid crendetials!");

    //  OriginalPassword !== req.body.password && res.status(401).json("Wrong credentials!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

module.exports = router;
