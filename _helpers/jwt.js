const expressJwt = require("express-jwt");
const config = require("../config.json");
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
  const { secret } = config;
  return expressJwt({ secret, isRevoked }).unless({
    path: ["/users/authenticate", "/users/register", "/reset/", "/reset/setnewpassword"]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.user);

  if (!user) {
    return done(null, true);
  }

  done();
}
