define(['services/datacontext',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger'],
    function (datacontext, router, system, app, logger) {
        var session = ko.observable();
        var rooms = ko.observableArray();
        var tracks = ko.observableArray();
        var timeSlots = ko.observableArray();
        var isSaving = ko.observable(false);
        var isDeleting = ko.observable(false);

        var activate = function (routeData) {
            var id = parseInt(routeData.id);
            initLookups();
            return datacontext.getSessionById(id, session);
        };

        var initLookups = function() {
            rooms(datacontext.lookups.rooms);
            tracks(datacontext.lookups.tracks);
            timeSlots(datacontext.lookups.timeslots);
        };

        var goBack = function () {
            router.navigateBack();
        };

        var hasChanges = ko.computed(function() {
            return datacontext.hasChanges();
        });

        var cancel = function() {
            datacontext.cancelChanges();
        };

        var canSave = ko.computed(function() {
            return hasChanges() && !isSaving();
        });
        
        var save = function () {
            isSaving(true);
            return datacontext.saveChanges().fin(complete);
            
            function complete() {
                isSaving(false);
            }
        };

        var deleteSession = function() {
            var msg = 'Delete session "' + session().title() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);
            
            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    session().entityAspect.setDeleted();
                    save().then(success).fail(failed).fin(finish);
                }
                isDeleting(false);

                function success() {
                    router.navigateTo('#/sessions');
                }

                function failed(error) {
                    cancel();
                    var errorMsg = 'Error: ' + error.message;
                    logger.logError(
                        errorMsg, error, system.getModuleId(vm), true);
                }

                function finish() {
                    return selectedOption;
                }
            }
            
        };

        var canDeactivate = function () {
            if (isDeleting()) { return false; }

            if (hasChanges()) {
                var title = 'Do you want to leave "' +
                    session().title() + '" ?';
                var msg = 'Navigate away and cancel your changes?';
                
                return app.showMessage(title, msg, ['Yes', 'No'])
                    .then(checkAnswer);
            }
            return true;

            function checkAnswer(selectedOption) {
                if (selectedOption === 'Yes') {
                    cancel();
                }
                return selectedOption;
            }
        };

        var vm = {
            activate: activate,
            cancel: cancel,
            canDeactivate: canDeactivate,
            canSave: canSave,
            deleteSession: deleteSession,
            goBack: goBack,
            hasChanges: hasChanges,
            rooms: rooms,
            tracks: tracks,
            timeSlots: timeSlots,
            save: save,
            session: session,
            title: 'Session Details'
        };
        return vm;
    });