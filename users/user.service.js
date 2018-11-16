const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const User = db.User;
const Board = db.Board;
const List = db.List;
const Card = db.Card;


module.exports = {
  authenticate,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate({ email, password }) {
  const user = await User.findOne({ email: email });
  
  const userObj = {
    user: user.id,
    email:user.email,
    name: user.name,
    surname: user.surname,
  }

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(userObj, config.secret, {expiresIn: '7 days'});

    const { password, ...userWithoutPass } = user.toObject();

    return {
      ...userWithoutPass,
      token
    };
  }
}

/* Get all users */

// async function getAll() {
//   return await User.find({}).select("-hash");
// }

/* Get user by id */

async function getById(id) {
  return await User.findById(id).select("-password");
}

/* 
* Create new user 
*/

async function create(userParam) {
  if (await User.findOne({ email: userParam.email })) {
    throw "This email is already taken!";
  }

  const user = new User(userParam);

  if (userParam.password) {
    user.password = bcrypt.hashSync(userParam.password, 10);
  }
  user.save();
}

/* 
* Update user params 
*/

async function update(id, userParam) {
  const user = await User.findById(id);
  
  // if there is no such a user
  if (!user) throw "User not found";

  // if email is taken already
  if (
    user.email !== userParam.email &&
    (await User.findOne({ email: userParam.email }))
  ) {
    throw "The mail - '" + userParam.email + "' is already taken!";
  }

  // if user wants to change password
  if (userParam.password) {

    if(userParam.oldPassword == userParam.confirmPassword) {

      if(bcrypt.compareSync(userParam.oldPassword, user.password)){

        user.password = bcrypt.hashSync(userParam.password, 10);
        return user.save();

      } else {

        throw new Error('Incorrect password!')

      }
    } else {

      throw new Error('Password does\'nt match to confirmation!!!');

    }
  }

  // copy and rewrite userParam props to user
  await user.update(userParam);
}

/*
* delete user and all dependant docs in other Collections
*/
async function _delete(id) {
  const user = await User.findById(id);

  if(!user || !id) throw new Error('Provide valid User ID');

  // Delete all Child dependant documents
  Card.deleteMany({owner: id});
  List.deleteMany({owner: id});
  Board.deleteMany({owner: id});

  return await User.findByIdAndDelete(id);

}
