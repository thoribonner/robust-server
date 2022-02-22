const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");
const pastesRouter = require('./pastes/pastes.router');

// * middleware
app.use(express.json());

// * routes

app.use('/pastes', pastesRouter);

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
