const express = require("express");
const app = express();
const usersRouter = require('./users/users.router');
const pastesRouter = require('./pastes/pastes.router');

// * allows us to send responses as json
app.use(express.json());

// * routes
app.use('/users', usersRouter);
app.use('/pastes', pastesRouter);

// // * does this correctly route our paths??
// app.use('/users/:userId/pastes', pastesRouter);

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
