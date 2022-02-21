const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

// TODO: Follow instructions in the checkpoint to implement ths API.

// * routes
app.use('/pastes/:pasteId', (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find( paste => paste.id === Number(pasteId));
  foundPaste ? res.json({ data: foundPaste }) : next(`Paste id not found: ${pasteId}`);
})
app.use("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// * not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// * error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.send(err);
});

module.exports = app;
