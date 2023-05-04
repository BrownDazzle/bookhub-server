const ChatModel = require("../models/chatModel");
const User = require("../models/User");
const express = require("express")
const router = express.Router()

router.post('/', async (req, res) => {

  try {
    const admin = await User.find({ isAdmin: true })
    const receiverId = await admin[0]

    const newChat = new ChatModel({
      members: [req.body.senderId, receiverId._id],
    });

    const result = await newChat.save();
    console.log("AdminR", result)
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:userId', async (req, res) => {
  try {

    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
}
);

router.get('/admin', async (req, res) => {
  try {
    const admin = await User.find({ isAdmin: true })

    console.log("Admin", admin)

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json(error);
  }
}
);
router.get('/find/:firstId/:secondId', async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
});

module.exports = router;
