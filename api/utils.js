function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      error: "MissingUserError",
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

module.exports = {
  requireUser,
};
