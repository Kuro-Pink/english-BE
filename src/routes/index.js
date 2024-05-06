const newsRouter = require('./news');
const siteRouter = require('./site');
const coursesRouter = require('./courses');
const questionRouter = require('./questions');
const authenRouter = require('./authens');
const meRouter = require('./me');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/courses', coursesRouter);
    app.use('/questions', questionRouter);
    app.use('/authens', authenRouter);
    app.use('/me', meRouter);

    app.use('/', siteRouter);
}

module.exports = route;

// app.get('/search', (req, res) => {
//     res.render('search');
//     console.log(req.query);
// });

// app.post('/search', (req, res) => {
//     console.log(req.body)
//     res.render('search');
// });
