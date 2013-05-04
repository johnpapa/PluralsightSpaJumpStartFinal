define(['durandal/system',
        'services/logger',
        'durandal/plugins/router',
        'durandal/app',
        'config',
        'services/datacontext'],
    function (system, logger, router, app, config, datacontext) {

        var adminRoutes = ko.computed(function() {
            return router.allRoutes().filter(function(r) {
                return r.settings.admin;
            });
        });

        var shell = {
            activate: activate,
            addSession: addSession,
            adminRoutes: adminRoutes,
            router: router
        };
        return shell;

        function activate() {
            app.title = config.appTitle;
            return datacontext.primeData()
                .then(boot)
                .fail(failedInitialization);
        }
        
        function boot() {
            logger.log('CodeCamper JumpStart Loaded!', null, system.getModuleId(shell), true);
            router.map(config.routes);
            return router.activate(config.startModule);
        }

        function addSession(item) {
            router.navigateTo(item.hash);
        }


        function failedInitialization(error) {
            var msg = 'App initialization failed: ' + error.message;
            logger.logError(msg, error, system.getModuleId(shell), true);
        }
    }
);