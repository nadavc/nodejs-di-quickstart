#!/bin/env node

var App = function () {

    var express = require('express');
    var http = require('http');
    var path = require('path');
    var fs = require('fs');
    var container = require('dependable').container();

    var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    var app = express();

    return {
        setupVariables: function () {
            if (typeof ipaddress === "undefined") {
                //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
                //  allows us to run/test the app locally.
                console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
                ipaddress = "127.0.0.1";
            }
        },

        /**
         *  terminator === the termination handler
         *  Terminate server on receipt of the specified signal.
         *  @param {string} sig  Signal to terminate on.
         */
        terminator: function (sig) {
            if (typeof sig === "string") {
                console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
                process.exit(1);
            }
            console.log('%s: Node server stopped.', Date(Date.now()));
        },


        /**
         *  Setup termination handlers (for exit and a list of signals).
         */
        setupTerminationHandlers: function () {
            //  Process on exit and signals.
            process.on('exit', function () {
                this.terminator();
            });

            // Removed 'SIGPIPE' from the list - bugz 852598.
            ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
                'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM']
                .forEach(function (element, index, array) {
                    process.on(element, function () {
                        this.terminator(element);
                    });
                });
        },

        initializeDI: function () {
            container.load(__dirname + '/routes/');
            container.load(__dirname + '/services/');
            container.load(__dirname + '/jobs/');
            container.register('config', require(__dirname + '/config.json'));
        },

        initializeServer: function () {
            // Express settings
            app.set('port', port);
            app.set('views', path.join(__dirname, 'views'));
            app.set('view engine', 'jade');
            app.use(express.favicon());
            app.use(express.logger('dev'));
            app.use(express.json());
            app.use(express.urlencoded());
            app.use(express.methodOverride());
            app.use(express.cookieParser('your secret here'));
            app.use(express.session());
            app.use(app.router);
            app.use(express.static(path.join(__dirname, 'public')));


            // Set up routing
            app.get('/', container.get('indexRoutes').list);
            app.get('/triggers', container.get('triggerRoutes').list);
            app.get('/triggers/log', container.get('triggerRoutes').logTest);
            app.get('/triggers/:id', container.get('triggerRoutes').triggerById);

        },

        initializeJobs: function () {
            container.get('phoneHomeJob').start();
        },

        initialize: function () {
            this.setupVariables();
            this.setupTerminationHandlers();
            this.initializeDI();
            this.initializeJobs();
            this.initializeServer();
        },

        start: function () {
            //  Start the app on the specific interface (and port).
            app.listen(port, ipaddress, function () {
                console.log('%s: Node server started on %s:%d ...', new Date(Date.now()), ipaddress, port);
            });
        }
    }

};

var app = new App();
app.initialize();
app.start();
