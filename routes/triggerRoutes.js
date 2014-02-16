var triggerRoutes = function () {

    return {
        list: function (req, res) {
            res.render('trigger');
        },

        triggerById: function (req, res) {
            res.render('output', {
                title: 'Triggers: ' + req.params.id,
                result: '[empty for now]'
            });
        },

        logTest: function (req, res) {
            res.send('yes!');
        }

    };

}

module.exports = triggerRoutes;
