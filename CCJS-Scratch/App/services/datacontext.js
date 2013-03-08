define([
    'durandal/system',
    'services/model',
    'config',
    'services/logger',
    'services/breeze.partial-entities'],
    function (system, model, config, logger, partialMapper) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var orderBy = model.orderBy;
        var entityNames = model.entityNames;
        
        var getSpeakerPartials = function (speakersObservable, forceRemote) {

            if (!forceRemote) {                
                var p = getLocal('Persons', orderBy.speaker);
                if (p.length > 0) {
                    speakersObservable(p);
                    return Q.resolve();
                }
            }

            var query = EntityQuery.from('Speakers')
                .select('id, firstName, lastName, imageSource')
                .orderBy(orderBy.speaker);

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.speaker, 'id');
                if (speakersObservable) {
                    speakersObservable(list);
                }
                log('Retrieved [Speaker] from remote data source',
                    data, true);
            }
        };
        
        var getSessionPartials = function (sessionsObservable, forceRemote) {
            if (!forceRemote) {
                var s = getLocal('Sessions', orderBy.session);
                if (s.length > 3) {
                    // Edge case
                    // We need this check because we may have 1 entity already.
                    // If we start on a specific person, this may happen. So we check for > 2, really
                    sessionsObservable(s);
                    return Q.resolve();
                }
            }

            var query = EntityQuery.from('Sessions')
                .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
                .orderBy('timeSlotId, level, speaker.firstName');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.session, 'id');
                if (sessionsObservable) {
                    sessionsObservable(list);
                }
                log('Retrieved [Sessions] from remote data source',
                    data, true);
            }
        };

        var getSessionById = function(sessionId, sessionObservable) {
            // 1st - fetchEntityByKey will look in local cache 
            // first (because 3rd parm is true) 
            // if not there then it will go remote
            return manager.fetchEntityByKey(
                entityNames.session, sessionId, true)
                .then(fetchSucceeded)
                .fail(queryFailed);
            
            // 2nd - Refresh the entity from remote store (if needed)
            function fetchSucceeded(data) {
                var s = data.entity;
                return s.isPartial() ? refreshSession(s) : sessionObservable(s);
            }
            
            function refreshSession(session) {
                return EntityQuery.fromEntities(session)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }
            
            function querySucceeded(data) {
                var s = data.results[0];
                s.isPartial(false);
                log('Retrieved [Session] from remote data source', s, true);
                return sessionObservable(s);
            }

        };

        var cancelChanges = function() {
            manager.rejectChanges();
            log('Canceled changes', null, true);
        };

        var saveChanges = function() {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);
            
            function saveSucceeded(saveResult) {
                log('Saved data successfully', saveResult, true);
            }
            
            function saveFailed(error) {
                var msg = 'Save failed: ' + getErrorMessages(error);
                logError(msg, error);
                error.message = msg;
                throw error;
            }
        };

        var primeData = function () {
            var promise = Q.all([
                getLookups(),
                getSpeakerPartials(null, true)])
                .then(applyValidators);

            return promise.then(success);
            
            function success() {
                datacontext.lookups = {
                    rooms: getLocal('Rooms', 'name', true),
                    tracks: getLocal('Tracks', 'name', true),
                    timeslots: getLocal('TimeSlots', 'start', true),
                    speakers: getLocal('Persons', orderBy.speaker, true)
                };
                log('Primed data', datacontext.lookups);
            }
            
            function applyValidators() {
                model.applySessionValidators(manager.metadataStore);
            }

        };

        var createSession = function() {
            return manager.createEntity(entityNames.session);
        };

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function(eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });

        var datacontext = {
            createSession: createSession,
            getSessionPartials: getSessionPartials,
            getSpeakerPartials: getSpeakerPartials,
            hasChanges: hasChanges,
            getSessionById: getSessionById,
            primeData: primeData,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges
        };

        return datacontext;

        //#region Internal methods        
        
        function getLocal(resource, ordering, includeNullos) {
            var query = EntityQuery.from(resource)
                .orderBy(ordering);
            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }
            return manager.executeQueryLocally(query);
        }
        
        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            }
            return msg;
        }
        
        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entitiesWithErrors.map(function(entity) {
                    // get each validation error
                    return entity.entityAspect.getValidationErrors().map(function(valError) {
                        // return the error message from the validation
                        return valError.errorMessage;
                    }).join('; <br/>');
                }).join('; <br/>');
            }
            catch (e) { }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logError(msg, error);
            throw error;
        }

        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        function getLookups() {
            return EntityQuery.from('Lookups')
                .using(manager).execute()
                .then(processLookups)
                .fail(queryFailed);
        }
        
        function processLookups() {
            model.createNullos(manager);
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }
        //#endregion
});