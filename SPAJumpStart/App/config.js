define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var imageSettings = {
        imageBasePath: '../content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg'
    };

    var remoteServiceName = 'breeze/Breeze';

    var routes = [{
        url: 'sessions',
        moduleId: 'viewmodels/sessions',
        name: 'Sessions',
        visible: true,
        caption: '<i class="icon-book"></i> Sessions'
    }, {
        url: 'speakers',
        moduleId: 'viewmodels/speakers',
        name: 'Speakers',
        visible: true,
        caption: '<i class="icon-user"></i> Speakers'
    }, {
        url: 'sessiondetail/:id',
        moduleId: 'viewmodels/sessiondetail',
        name: 'Edit Session',
        visible: false
    }, {
        url: 'sessionadd',
        moduleId: 'viewmodels/sessionadd',
        name: 'Add Session',
        visible: false,
        caption: '<i class="icon-plus"></i> Add Session',
        settings: {admin: true}
    }];
    
    var startModule = 'sessions';

    return {
        debugEnabled: ko.observable(true),
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        routes: routes,
        startModule: startModule
    };
});