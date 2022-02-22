const router = require("express").Router({ mergeParams: true });
const controller = require("./pastes.controller");
const methodNotAllowed = require("../errors/methodsNotAllowed");

router
  .route("/:pasteId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
