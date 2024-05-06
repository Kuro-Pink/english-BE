const Course = require("../../models/Course");
const Question = require("../../models/Question");
const { mongooseToObject } = require("../../util/mongoose");

class CourseController {
  // [GET] /courses:slug
  show(req, res, next) {
    const hasCookie = req.cookies.accessToken;
    if (!hasCookie) return res.redirect("/authens/login");
    Course.findOne({ slug: req.params.slug })
      .then((course) => {
        res.render("courses/show", {
          course: mongooseToObject(course),
          hasCookie,
        });
      })
      .catch(next);
    //Question
    Question.findOne({ slug: req.params.slug })
      .then((question) =>
        res.render("questions/show", {
          question: mongooseToObject(question),
        })
      )
      .catch(next);
  }

  //  [GET] /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }

  //  [POST] /courses/store
  store(req, res, next) {
    req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCML-byK5TPhWN_-ZuZal4h5KasYw`;
    const course = new Course(req.body);
    course
      .save()
      .then(() => res.redirect(`/me/stored/courses`))
      .catch(next);
  }

  //  [GET] /courses/edit/:id
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then((course) => {
        res.render("courses/edit", {
          course: mongooseToObject(course),
        });
        console.log(course.name);
      })
      .catch(next);
  }

  //  [PUT] /courses/:id
  update(req, res, next) {
    Course.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        image: `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCML-byK5TPhWN_-ZuZal4h5KasYw`,
      }
    )
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  //  [DELETE] /courses/:id
  destroy(req, res, next) {
    Course.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  //  [DELETE] /courses/:id
  forceDestroy(req, res, next) {
    Course.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  //  [PATCH] /courses/restore/:id
  restore(req, res, next) {
    Course.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  //  [POST] /courses/handle-form
  handleForm(req, res, next) {
    switch (req.body.action) {
      case "delete":
        Course.delete({ _id: { $in: req.body.courseId } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "Invalid action" });
    }
  }
}

module.exports = new CourseController();
