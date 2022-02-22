const pastes = require("../data/pastes-data");

// * validation
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

function pasteExists(req, res, nxt) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  foundPaste
    ? nxt()
    : nxt({ status: 404, message: `Paste ID not found: ${pasteId}` });
}

function bodyDataHas(propertyName) {
  return function (req, res, nxt) {
    const { data = {} } = req.body;
    data[propertyName]
      ? nxt()
      : nxt({
          status: 400,
          message: `Must include '${propertyName}' property`,
        });
  };
}

function exposurePropertyIsValid(req, res, nxt) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  validExposure.includes(exposure)
    ? nxt()
    : nxt({
        status: 400,

        message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
      });
}

function syntaxPropertyIsValid(req, res, nxt) {
  const { data: { syntax } = {} } = req.body;

  const validSyntax = [
    "None",
    "Javascript",
    "Python",
    "Ruby",
    "Perl",
    "C",
    "Scheme",
  ];
  validSyntax.includes(syntax)
    ? nxt()
    : nxt({
        status: 400,

        message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
      });
}

function expirationIsValidNumber(req, res, nxt) {
  const { data: { expiration } = {} } = req.body;
  expiration <= 0 || !Number.isInteger(expiration)
    ? nxt({
        status: 400,

        message: `Expiration requires a valid number`,
      })
    : nxt();
}
// * end of validation

// * list / GET
function list(req, res) {
  res.json({ data: pastes });
}

// * create / POST
function create(req, res) {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body;
  const newPaste = {
    id: ++lastPasteId,
    name,
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
}

// * read / GET by id
function read(req, res) {
  const { pasteId } = Number(req.params.pasteId);
  const foundPaste = pastes.find((paste) => paste.id === pasteId);
  res.json({ data: foundPaste });
}

// * update / PUT
function update(req, res) {
  const { pasteId } = Number(req.params.pasteId);
  const foundPaste = pastes.find((paste) => paste.id === pasteId);
  const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
  foundPaste.name = name;
  foundPaste.syntax = syntax;
  foundPaste.expiration = expiration;
  foundPaste.exposure = exposure;
  foundPaste.text = text;

  res.json({ data: foundPaste });
}

// * destroy / DELETE
function destroy(req, res) {
  const { pasteId } = req.params;
  const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
  const deletedPastes = pastes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    expirationIsValidNumber,
    syntaxPropertyIsValid,
    create,
  ],
  delete: [pasteExists, destroy],
  list,
  read: [pasteExists, read],
  update: [
    pasteExists,
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    update,
  ],
};