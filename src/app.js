const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

// TODO: Follow instructions in the checkpoint to implement ths API.

app.use(express.json());
// * routes
app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  foundPaste
    ? res.json({ data: foundPaste })
    : next(`Paste id not found: ${pasteId}`);
});

// * api requests
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

app.post("/pastes", (req, res, nxt) => {
  let lastPasteId = pastes.reduce(
    (maxId, paste) => Math.max(maxId, paste.id),
    0
  );
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body;
  if (text) {
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
  } else {
    res.sendStatus(400);
  }
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
