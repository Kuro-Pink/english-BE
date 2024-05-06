const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authen = require("../../models/Authen");
const Course = require("../../models/Course");

const refreshTokens = [];

class AuthensController {
  // [GET] /search
  register(req, res) {
    res.render("authens/register");
  }

  //[POST]
  // Đăng ký: ktra xem đã có tên người dùng và mã hóa password
  store(req, res, next) {
    try {
      //Check if the user already exists in the database
      Authen.findOne({ code: req.body.code })
        .then((user) => {
          if (user) {
            res.send("Mã học sinh đã tồn tại, vui lòng nhập mã học sinh khác");
          }
          // //Has the password ussing bcript
          const saltRounds = 10; //Number of salt for bcrypt
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            req.body.replacePassword = hash; // Replace the hash password with origin password

            const authen = new Authen(req.body);
            authen
              .save()
              .then(() => res.render("authens/login"))
              .catch(next);
          });
        })
        .catch(next);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  login(req, res) {
    res.render("authens/login");
  }

  //Login: check xem  có username chưa và so sánh passwordValue với password trong DB
  signin(req, res) {
    try {
      Authen.findOne({ code: req.body.code }).then((user) => {
        if (user) {
          //Compare the hash password from the database with t  he plain text
          bcrypt.compare(
            req.body.password,
            user.replacePassword,
            (err, result) => {
              if (!result) {
                res.send("Mật khẩu không chính xác, vui lòng nhập lại.");
              }
              if (user && result) {
                //Access token
                const accessToken = jwt.sign(
                  {
                    id: user.id,
                    admin: user.admin,
                    role: user.role,
                  },
                  process.env.JWT_ACCESS_KEY,
                  { expiresIn: "1h" }
                );
                //Refresh token
                const refreshToken = jwt.sign(
                  {
                    id: user.id,
                    admin: user.admin,
                    role: user.role,
                  },
                  process.env.JWT_REFRESH_KEY,
                  { expiresIn: "365d" }
                );
                refreshTokens.push(refreshToken);
                //Store token
                res.cookie("accessToken", accessToken, {
                  httpOnly: true,
                  secure: false,
                  sameSite: "strict",
                });
                // res.cookie("refreshToken", refreshToken, {
                //   httpOnly: true,
                //   secure: false,
                //   sameSite: "strict",
                // });

                // const { password, replacePassword, ...other } = user._doc;
                // res.status(200).json({
                //   ...other,
                //   accessToken,
                //   refreshToken,
                // });
                res.redirect("/");
              }
            }
          );
        } else {
          res.send("Không tìm thấy mã học sinh.");
        }
        return user;
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //Nên dùng redis
  requestRefreshToken(req, res, next) {
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken))
      return res.status(403).json("Refresh token is not valid");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) return console.log(err);
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      //Create new token
      const newAccessToken = jwt.sign(
        {
          id: user.id,
          admin: user.admin,
          role: user.role,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "365d" }
      );
      const newRefreshToken = jwt.sign(
        {
          id: user.id,
          admin: user.admin,
          role: user.role,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
      );
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  }

  logout(req, res, next) {
    res.clearCookie("accessToken");
    res.redirect("/");
  }
}

module.exports = new AuthensController();
