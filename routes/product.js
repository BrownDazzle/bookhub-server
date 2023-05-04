const Book = require("../models/Book");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const express = require("express");
const path = require("path");
//const { StatusCodes } = require("http-status-codes");
// CustomError = require('../errors');
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

//CREATE

router.post("/", /*verifyTokenAndAdmin*/ async (req, res) => {
  console.log(req.body)
  const imgFile = Buffer.from(req.body.cover, "binary");
  const emerginacts = process.env.AWS_BUCKET;
  const title = req.body.title

  const imgLink = await uploadImage(title, emerginacts, imgFile)
  console.log(imgLink)

  const obj = {
    title,
    publisher: req.body.publisher,
    price: req.body.price,
    desc: req.body.desc,
    cover: imgLink,
    category: req.body.category,
    subCategory: req.body.subCategory,
    tags: req.body.tags
  }

  const newBook = new Book(obj);

  try {
    const savedBook = await newBook.save();
    res.status(200).json(savedBook);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json("Book has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    console.log(book)
    res.status(200).json(book);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//GET BOOKS BY CATEGORY
router.get("/category/:category", async (req, res) => {
  const { category } = req.params
  try {
    // const term = category.toLowerCase()
    // console.log(term)
    const book = await Book.find({ category: category });
    console.log(book)
    res.status(200).json(book)
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get("/subCategory/:subCategory", async (req, res) => {
  const { subCategory } = req.params
  try {

    if (subCategory === "All") return null

    const book = await Book.find({ subCategory });
    console.log(book)
    res.status(200).json(book)
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//GET ALL BookS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let books;

    if (qNew) {
      books = await Book.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      books = await Book.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      books = await Book.find();
    }

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search/books", async (req, res) => {
  const { query } = req.query;
  console.log(query)

  try {
    const title = new RegExp(query, "i");

    const bookResults = await Book.find({ $or: [{ title }] });
    /*
      const posts = await Post.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] });
  */
    console.log("Query", bookResults);

    res.status(200).json(bookResults);
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: error.message })
  }
});

module.exports = router;
