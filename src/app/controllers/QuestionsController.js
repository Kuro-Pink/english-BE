const Question = require("../../models/Question");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../util/mongoose");

class QuestionController {
  //[GET] /questions:slug
  show(req, res, next) {
    const hasCookie = req.cookies.accessToken;
    if (!hasCookie) return res.redirect("/authens/login");
    Question.find({})
      .then((questions) => {
        res.render("questions/show", {
          questions: multipleMongooseToObject(questions),
          hasCookie,
        });
      })
      .catch(next);
    Question.findOne({ slug: req.params.slug })
      .then((question) =>
        res.render("questions/show", {
          question: mongooseToObject(question),
        })
      )
      .catch(next);
  }

  //  [GET] /questions/create
  create(req, res, next) {
    res.render("questions/create");
  }

  //  [POST] /questions/store
  store(req, res, next) {
    const question = new Question(req.body);
    question
      .save()
      .then(() => res.redirect(`/me/stored/questions`))
      .catch(next);
  }

  //  [GET] /questions/edit/:id
  edit(req, res, next) {
    Question.findById(req.params.id)
      .then((question) =>
        res.render("questions/edit", {
          question: mongooseToObject(question),
        })
      )
      .catch(next);
  }

  //  [PUT] /questions/:id
  update(req, res, next) {
    Question.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
      }
    )
      .then(() => res.redirect("/me/stored/questions"))
      .catch(next);
  }

  //  [DELETE] /questions/:id
  destroy(req, res, next) {
    Question.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  //  [DELETE] /questions/:id
  forceDestroy(req, res, next) {
    Question.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  //  [PATCH] /questions/restore/:id
  restore(req, res, next) {
    Question.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  //  [POST] /questions/handle-form
  handleForm(req, res, next) {
    switch (req.body.action) {
      case "delete":
        Question.delete({ _id: { $in: req.body.questionId } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "Invalid action" });
    }
  }
}

module.exports = new QuestionController();
