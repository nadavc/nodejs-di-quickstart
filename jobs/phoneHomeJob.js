var phoneHome = function (mailerService) {

    var intervalId;

    return {
        activate: function () {
            mailerService.send('yourmail@gmail.com', "I'm up");
        },

        start: function () {
            // phone home every 24 hours
            intervalId = setInterval(this.activate, 24 * 60 * 60 * 1000);
        },

        stop: function () {
            clearInterval(intervalId);
        }

    }

};

module.exports = phoneHome;
