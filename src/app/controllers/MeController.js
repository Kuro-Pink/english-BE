const Course = require('../../models/Course');
const Question = require('../../models/Question');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {
    //[GET] /me/stored/courses
    storedCourses(req, res, next) {
        let questionQuery = Course.find({});
        if (req.query.hasOwnProperty('_sort')) {
            questionQuery = questionQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([questionQuery, Course.findDeleted({})]) //[questionQuery, Course.find({}), Course.findDeleted({})]
            .then(([courses, deletedCount]) =>
                res.render('me/stored-courses', {
                    courses: multipleMongooseToObject(courses),
                    deletedCount: deletedCount.filter(
                        (course) => course.deleted,
                    ).length,
                }),
            )
            .catch(next);
    }

    //[GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findWithDeleted({ deleted: true })
            .then((courses) =>
                res.render('me/trash-courses', {
                    courses: multipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }

    //[GET] /me/stored/questions
    storedQuestions(req, res, next) {
        let questionQuery = Question.find({});
        if (req.query.hasOwnProperty('_sort')) {
            questionQuery = questionQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([questionQuery, Question.findDeleted({})]) //[questionQuery, Course.find({}), Course.findDeleted({})]
            .then(([questions, deletedCount]) =>
                res.render('me/stored-questions', {
                    questions: multipleMongooseToObject(questions),
                    deletedCount: deletedCount.filter(
                        (question) => question.deleted,
                    ).length,
                }),
            )
            .catch(next);
    }

    //[GET] /me/trash/questions
    trashQuestions(req, res, next) {
        Question.findWithDeleted({ deleted: true })
            .then((questions) =>
                res.render('me/trash-questions', {
                    questions: multipleMongooseToObject(questions),
                }),
            )
            .catch(next);
    }
}

module.exports = new MeController();
