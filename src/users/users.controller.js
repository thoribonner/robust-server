const users = require("../data/users-data");

function list(req, res) {
  res.json({ data: users });
}

function userExists(req, res, nxt) {
  const { userId } = req.params;
  const foundUser = users.find((user) => user.id === Number(userId));

  if (foundUser) {
    res.locals.user = foundUser;
    return nxt();
  }
  nxt({ status: 404, message: `User ID not found: ${userId}` });
}

function read(req, res) {
  res.json({ data: res.locals.user });
}


module.exports = {
  list,
  read: [userExists, read],
  userExists
}