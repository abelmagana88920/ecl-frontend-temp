import angular from 'angular';

(function (){
    'use strict';

    angular
        .module('app')
        .directive('tabToNext', tabToNext);

    function tabToNext () {
        return {
            restrict: "A",
            link: function($scope, element) {
                element.on("input", function(e) {
                    if(element.val().length == element.attr("maxlength")) {
                        var $nextElement = element.next();
                        if($nextElement.length) {
                            $nextElement[0].focus();
                        }
                    }
                });
            }
        }
    }

})();