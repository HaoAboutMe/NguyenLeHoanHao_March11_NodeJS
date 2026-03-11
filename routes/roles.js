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

module.exports = router;