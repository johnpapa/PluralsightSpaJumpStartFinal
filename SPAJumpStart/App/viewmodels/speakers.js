define(['services/datacontext'], function (datacontext) {
    var speakers = ko.observableArray();

    var activate = function () {
        // go get local data, if we have it
        return datacontext.getSpeakerPartials(speakers);
    };
    var refresh = function () {
        return datacontext.getSpeakerPartials(speakers, true);
    };

    var vm = {
        activate: activate,
        speakers: speakers,
        title: 'Speakers',
        refresh: refresh
    };
    
    return vm;
});