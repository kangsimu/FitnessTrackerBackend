function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action",
      });
    }
    next();
  }
  
  function requireActiveUser(req, res, next) {
    if (req.user) {
      if(!req.user.active) {
        next(JSON.stringify({
          name: "ActivationError",
          message: "Your account must be active in order to perform this action",
        }));
      } else {
        next();      
      }
    }
  }
  
  module.exports = {
    requireUser,
    requireActiveUser
  };