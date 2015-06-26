//fadeVisible: <div data-bind="fadeVisible: shouldDisplay() == true, fadeDuration: 500"></div>
ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        var shouldDisplay = valueAccessor();
        $(element).toggle(shouldDisplay);
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var shouldDisplay = valueAccessor(),
            allBindings = allBindingsAccessor(),
            duration = allBindings.fadeDuration || 500;
        shouldDisplay ? $(element).fadeIn(duration) : $(element).fadeOut(duration);
    }
};