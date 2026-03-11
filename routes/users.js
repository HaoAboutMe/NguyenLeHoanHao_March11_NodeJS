var express = require('express');
var router = express.Router();
let userModel = require('../schemas/user')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let result = await userModel.find({
    isDeleted: false
  }).populate({
    path: "role",
    select: "name"
  })
  res.send(result)
});

router.post("/", async function(req, res, next) {
  try {
    let newUser = new userModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        status: req.body.status,
        role: req.body.role,
        loginCount: req.body.loginCount
    });

    await newUser.save();
    // Populate sau khi save để lấy thông tin role
    await newUser.populate({
      path: "role",
      select: "name"
    });
    
    res.send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
})

// Get user by ID
router.get("/:id", async function(req, res, next) {
  try {
    let result = await userModel.findById(req.params.id).populate({
      path: "role",
      select: "name"
    });
    if (!result || result.isDeleted) {
      return res.status(404).send({ message: "USER NOT FOUND" });
    }
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

// Soft delete user
router.delete("/:id", async function(req, res, next) {
  try {
    let result = await userModel.findById(req.params.id);
    if (!result || result.isDeleted) {
      return res.status(404).send({ message: "USER NOT FOUND" });
    }
    result.isDeleted = true;
    await result.save();
    res.send({ message: "Soft deleted successfully", data: result });
  } catch (error) {
    res.status(404).send({ message: "USER NOT FOUND" });
  }
});

// Enable user status by email and username
router.post("/enable", async function(req, res, next) {
  try {
    const { email, username } = req.body;
    
    // Tìm user khớp cả email và username, và chưa bị xóa mềm
    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).send({ message: "EMAIL OR USERNAME INCORRECT OR USER DELETED" });
    }

    user.status = true;
    await user.save();

    res.send({ message: "User enabled successfully", data: user });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Disable user status by email and username
router.post("/disable", async function(req, res, next) {
  try {
    const { email, username } = req.body;
    
    // Tìm user khớp cả email và username, và chưa bị xóa mềm
    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });

    if (!user) {
      return res.status(404).send({ message: "EMAIL OR USERNAME INCORRECT OR USER DELETED" });
    }

    user.status = false;
    await user.save();

    res.send({ message: "User disabled successfully", data: user });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
