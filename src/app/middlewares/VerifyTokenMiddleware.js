const jwt = require("jsonwebtoken");
const VerifyTokenMiddleware = {
  //Verify token
  verifyToken: (req, res, next) => {
    const token = req.header.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  },

  //Verify is user or admin to delete other user
  verifyTokenAndAdminAuth: (req, res, next) => {
    VerifyTokenMiddleware.verifyToken(req, res, () => {
      if (req.user.id == req.param.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not allowed to delete other");
      }
    });
  },
};

module.exports = VerifyTokenMiddleware;
