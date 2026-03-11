var express = require('express');
var router = express.Router();
const slugify = require('slugify');
let roleModel = require('../schemas/role')

//Hàm get all role
router.get("/", async function(req, res, next){
    let result = await roleModel.find({
        isDeleted:false
    })
    res.send(result)
})

router.post("/", async function(req, res, next) {
    let newRole = new roleModel({
        name: req.body.name,
        description: req.body.description
    })

    await newRole.save();
    res.send(newRole);
})

// Get role by ID
router.get("/:id", async function(req, res, next) {
  try {
    let result = await roleModel.findById(req.params.id);
    if (!result || result.isDeleted) {
      return res.status(404).send({ message: "ROLE NOT FOUND" });
    }
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: "ROLE NOT FOUND" });
  }
});

// Xóa mềm role
router.delete("/:id", async function(req, res, next) {
  try {
    let result = await roleModel.findById(req.params.id);
    if (!result || result.isDeleted) {
      return res.status(404).send({ message: "ROLE NOT FOUND" });
    }
    result.isDeleted = true;
    await result.save();
    res.send({ message: "Soft deleted successfully", data: result });
  } catch (error) {
    res.status(404).send({ message: "ROLE NOT FOUND" });
  }
});

let userModel = require("../schemas/user");
// Lấy tất cả user thuộc một role ID cụ thể
router.get("/:id/users", async function (req, res, next) {
  try {
    let roleId = req.params.id;
    // Kiểm tra xem role có tồn tại không
    let role = await roleModel.findById(roleId);
    if (!role || role.isDeleted) {
      return res.status(404).send({ message: "ROLE NOT FOUND" });
    }

    // Tìm tất cả user có role khớp với roleId và chưa bị xóa mềm
    let result = await userModel.find({
      role: roleId,
      isDeleted: false
    }).populate({
      path: "role",
      select: "name"
    });

    res.send(result);
  } catch (error) {
    res.status(404).send({ message: "ROLE NOT FOUND OR INVALID ID" });
  }
});

module.exports = router;