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

module.exports = router;
