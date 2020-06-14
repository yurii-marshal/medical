(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("editField", editField);

    editField.$inject = [];

    function editField() {
        var directive = {
            restrict: "A",
            scope: {
                isUpdated: "="
            },
            link: function (scope, elem, attr, ctrl) {

                $(elem).find('.edit-filter-btn').on('click', function(){
                    $(elem).find('input').val($(elem).find('.filter-name').text());
                    $(elem).addClass('editing');
                });

                $(document).on('click', function(event) {
                    if(!$(event.target).closest(elem).length &&
                        !$(event.target).is(elem)) {
                        if($(elem).hasClass('editing')) {
                            $(elem).removeClass('editing');
                        }
                    }
                });

                $(elem).find('input').keydown(function(e){
                    if(e.keyCode === 13 && scope.isUpdated){
                        $(elem).removeClass('editing');
                    } else if (e.keyCode === 27) {
                        $(elem).removeClass('editing');
                    }
                });

                $(elem).find('.save-filter-btn').click(function(){
                    $(elem).removeClass('editing');
                });

                scope.$on('$destroy', function() {
                    $(document).off('click');
                    $(elem).find('.save-filter-btn').off('click');
                });

                scope.$watch(function() {
                    return scope.isUpdated;
                }, function() {
                    if (scope.isUpdated) {
                        $(elem).removeClass('editing');
                    }
                });
            }
        };
        return directive;
    }
})();
