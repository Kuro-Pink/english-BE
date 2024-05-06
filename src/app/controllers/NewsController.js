class NewsController {
    //[GET] /news
    index(req, res) {
        res.render('news');
    }

    //[GET] /news/:slug
    show(req, res) {
        res.send(
            'Đây là 1 ngõ trên đường chính và trong từng ngõ sẽ có thêm nhiều ngách khác nhỏ hơn nữa! ahihi^.^',
        );
    }
}

module.exports = new NewsController();
