const Authen = require("../../models/Authen");
const Course = require("../../models/Course");
const { multipleMongooseToObject } = require("../../util/mongoose");

class SiteController {
  // [GET] /  (Home)
  index(req, res, next) {
    const hasCookie = req.cookies.accessToken;
    if (!hasCookie) return res.redirect("/authens/login");
    Course.find({})
      .then((courses) => {
        res.render("home", {
          courses: multipleMongooseToObject(courses),
          hasCookie,
        });
      })
      .catch(next);
  }

  // [GET] /search
  default(req, res) {
    res.render("/authens/login");
  }
  // [GET] /search
  search(req, res) {
    res.render("search");
  }
}

module.exports = new SiteController();
