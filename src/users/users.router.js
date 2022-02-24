const router = require("express").Router();
const controller = require("./users.controller");
const methodNotAllowed = require("../errors/methodsNotAllowed");

const pastesRouter = require("../pastes/pastes.router");

// * not "RESTful"
// * how to make "RESTful"???
// * add userId validation to pastes.controller??
router.use("/:userId/pastes", controller.userExists, pastesRouter);


router.route("/:userId").get(controller.read).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
