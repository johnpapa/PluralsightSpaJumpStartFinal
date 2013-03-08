require.config({
    paths: { "text": "durandal/amd/text" }
});

define(function(require) {
    var system = require('durandal/system'),
        app = require('durandal/app'),
        router = require('durandal/plugins/router'),
        viewLocator= require('durandal/viewLocator'),
        logger = require('services/logger');

    system.debug(true);
    
    app.start().then(function () {
        // route will use conventions for modules
        // assuming viewmodels/views folder structure
        router.useConvention();

        // When finding a module, replace the viewmodel string 
        // with view to find it partner view.
        // [viewmodel]s/sessions --> [view]s/sessions.html
        // Otherwise you can pass paths for modules, views, partials
        // Defaults to viewmodels/views/views. 
        viewLocator.useConvention();

        app.setRoot('viewmodels/shell', 'entrance');
        
        // override bad route behavior to write to 
        // console log and show error toast
        router.handleInvalidRoute = function(route, params) {
            logger.logError('No route found', route, 'main', true);
        };
    });

});