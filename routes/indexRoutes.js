var indexRoutes = function () {

    return {
        list: function (req, res) {
            res.render('index', { title: 'Smartass' });
        }
    }

};

module.exports = indexRoutes;