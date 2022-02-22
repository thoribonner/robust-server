const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

// * middleware
app.use(express.json());

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

function bodyHasTextProperty(req, res, nxt) {
  const { data: { text } = {} } = req.body;
  text ? nxt() : nxt({ status: 400, message: `A 'text' property is required.`});
}

// * routes
app.use("/pastes/:pasteId", (req, res, nxt) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  foundPaste
    ? res.json({ data: foundPaste })
    : nxt({ status: 404, message: `Paste id not found: ${pasteId}` });
});

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

app.post("/pastes", bodyHasTextProperty, (req, res, nxt) => {
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
});

// * not found handler
app.use((req, res, nxt) => {
  nxt({status: 404, message: `Not found: ${req.originalUrl}` });
});

// * error handler
app.use((err, req, res, nxt) => {
  console.error(err);
  const { status = 500, message = "Something went wrong!" } = err
  res.status(status).json({error : message});
});

module.exports = app;
