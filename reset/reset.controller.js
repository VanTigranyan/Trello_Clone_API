const express = require("express");
const router = express.Router();
const userService = require("../users/user.service");
const resetService = require("./reset.service");

router.post("/", sendMail);
router.post("/setnewpassword", setNewPassword);

module.exports = router;

function sendMail(req, res, next) {
  resetService
    .sendMail(req.body.email)
    .then(() => {
      res.json({ message: "Email confirmation has been sent successfuly!" });
    })
    .catch(err => next(err));
}

function setNewPassword(req, res, next) {
    const token = req.headers.authorization;
    i = token.indexOf(' ');
    req.body.confirmToken = token.slice(i+1);
    console.log(req.body)
  resetService
    .setNewPassword(req.body)
    .then(() => res.json({ message: "Password successfuly changed!" }))
    .catch(err => next(err));
}
