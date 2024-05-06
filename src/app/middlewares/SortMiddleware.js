module.exports = function SortMiddleware(req, res, next) {
    res.locals._sort = {
        enabled: false,
        type: 'default',
    };

    if (req.query.hasOwnProperty('_sort')) {
        Object.assign(res.locals._sort, {
            enabled: true,
            type: req.query.type,
            column: req.query.column,
        });
        // res.locals._sort.enabled = true
        // res.locals._sort.type = req.query.type
        // res.locals._sort.column = req.query.column
    }

    next();
};
