'use strict';
var moafDirectives = angular.module("moafDirectives", [])
var moafControllers = angular.module("moafControllers", []);
var moafServices = angular.module("moafServices", ['ngResource']);
var moafApp = angular.module("moafApp", [
    "ui.bootstrap",
    "ngCookies",
    "ngGrid",
    "ngRoute",
    "ng-context-menu",
    "moafControllers",
    "moafServices",
    "moafDirectives"

])

moafServices.factory("moafData", ["$resource", function($resource) {
    return $resource("moafData/:info.json", {}, {
        info: "@info",
        query: {
            method: "GET",
            params: {},
            isArray: true
        }

    })
}])

moafControllers.controller("mainCtrl", ["$scope", "$location", "$modal", "moafData", function($scope, $location, $modal, moafData) {
    //$scope.currentPage=$location.path().split("/")[$location.path().split("/").length-1];
    $scope.currentPage = $location.path().split("/")[$location.path().split("/").length - 1]
    $scope.showHideInfo = function(event, obj, show) {
        var parentEvent = angular.element(event.target).parents('.event').eq(0);
        var parentDecade = angular.element(event.target).parents('.decade').eq(0)[0];
        var eventItem = angular.element(event.target)
        var allEvents = angular.element('.event')
        angular.forEach(allEvents, function(_event) {
            angular.element(_event).find('.eventDetail')[0].style.display = 'none'
            angular.element(_event).parents('.decade')[0].style.zIndex = 1;
            angular.element(_event)[0].style.zIndex = 1;
            angular.element(_event)[0].style.opacity = 0.2;
        })
        console.log(show);
        var imgWrapper = parentEvent.find('.imageWrapper')[0];
        var eventDetail = angular.element(event.target).parents('.event').eq(0).find('.eventDetail');
        var eventMask = angular.element(event.target).parents('.event').eq(0).find('.eventMask')
        if (show) {
            parentEvent[0].className = parentEvent[0].className.replace(/\bimageHide\b/, '') + ' imageReveal';
            parentEvent[0].style.zIndex = 3;
            parentEvent[0].style.opacity = 1;
            //parentEvent[0].style.top="100px"
        } else {
            parentEvent[0].className = parentEvent[0].className.replace(/\bimageReveal\b/, '') + ' imageHide';
            parentEvent[0].style.zIndex = 1;
            angular.forEach(allEvents, function(_event) {

                angular.element(_event)[0].style.opacity = 1;
            })

        }

        parentDecade.style.zIndex = 2;
        eventDetail[0].style.display = "block";
        eventMask[0].style.opacity = 0;
        eventDetail[0].style.top = eventItem[0].style.top;


    }


    $scope.open = function(img) {
        $scope.image = img;
        var modalInstance = $modal.open({
            templateUrl: 'modal.html',
            controller: 'modalInstCtrl',
            resolve: {
                items: function() {
                    return $scope.items;
                },
                image: function() {
                    return $scope.image;
                }

            }
        });

        modalInstance.result.then(function(selectedItem) {

            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

}])

moafControllers.controller("timelineCtrl", ["$scope", "$rootScope", "moafData", function($scope, $rootScope, moafData) {

    $scope.eras = moafData.query({
        "info": "eras"
    }).$promise.then(function(result) {
        $scope.eras = $rootScope.eras = result;
        angular.forEach($rootScope.eras, function(era) {
            era.decades = _.groupBy(era.events, "eventDecade");
        })
    })

$scope.notes = moafData.query({
        "info": "noteTypeData"
    }).$promise.then(function(result) {
        $scope.noteTypes = $rootScope.noteTypes = result;
            $scope.noteGroups = _.groupBy($scope.noteTypes, "noteEra");
    })

    $scope.lineLeft = 0;
    $scope.move = function(dir) {
        if (dir == "right") {
            $scope.lineLeft -= 400
        } else if (dir == "left" && $scope.lineLeft < 0) {
            $scope.lineLeft += 400;
        }

    }
}])

moafDirectives.directive("draggable", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            elem.draggable({
                axis: "x"
            });
        }
    }

})

moafControllers.controller("collectCtrl", ["$scope", function($scope) {
    $scope.collections = {
        "notes": [{
            "title": "One Dollar Bill",
            "imageMain": "US_1Dollar_front",
            "imageHover": "US_1Dollar_back",
            "description": "Lorem ipsum dolor sit amet, lorem dolorem vix ei. Pri ea deserunt explicari. No mea modo eros, posse delicata tincidunt ad usu, labitur feugait eu est. Per atqui democritum appellantur ea, tota lucilius explicari has te. His nostrud liberavisse at."
        }, {
            "title": "Two Dollar Bill",
            "imageMain": "US_2Dollar_front",
            "imageHover": "US_2Dollar_back",
            "description": "Lorem ipsum dolor sit amet, lorem dolorem vix ei. Pri ea deserunt explicari. No mea modo eros, posse delicata tincidunt ad usu, labitur feugait eu est. Per atqui democritum appellantur ea, tota lucilius explicari has te. His nostrud liberavisse at."
        }, {
            "title": "Five Dollar Bill",
            "imageMain": "US_5Dollar_front",
            "imageHover": "US_5Dollar_back",
            "description": "Lorem ipsum dolor sit amet, lorem dolorem vix ei. Pri ea deserunt explicari. No mea modo eros, posse delicata tincidunt ad usu, labitur feugait eu est. Per atqui democritum appellantur ea, tota lucilius explicari has te. His nostrud liberavisse at."
        }, {
            "title": "Ten Dollar Bill",
            "imageMain": "US_10Dollar_front",
            "imageHover": "US_10Dollar_back",
            "description": "Lorem ipsum dolor sit amet, lorem dolorem vix ei. Pri ea deserunt explicari. No mea modo eros, posse delicata tincidunt ad usu, labitur feugait eu est. Per atqui democritum appellantur ea, tota lucilius explicari has te. His nostrud liberavisse at."
        }, {
            "title": "Twenty Dollar Bill",
            "imageMain": "US_20Dollar_front",
            "imageHover": "US_20Dollar_back",
            "description": "Lorem ipsum dolor sit amet, lorem dolorem vix ei. Pri ea deserunt explicari. No mea modo eros, posse delicata tincidunt ad usu, labitur feugait eu est. Per atqui democritum appellantur ea, tota lucilius explicari has te. His nostrud liberavisse at."
        }, {
            "title": "Hundred Dollar Bill",
            "imageMain": "US_100Dollar_front",
            "imageHover": "US_100Dollar_back",
            "description": "Lorem ipsum dolor sit amet, lorem dolorem vix ei. Pri ea deserunt explicari. No mea modo eros, posse delicata tincidunt ad usu, labitur feugait eu est. Per atqui democritum appellantur ea, tota lucilius explicari has te. His nostrud liberavisse at."
        }]


    }
    $scope.flipNote = function(note) {
        console.log(angular.element(note).find('div').attr('class'))
    }
}])


moafApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when('/timeline', {
        templateUrl: 'views/timeline',
        controller: 'timelineCtrl'

    }).otherwise({
        templateUrl: 'views/collections',
        controller: 'collectCtrl'

    })
}])


moafControllers.controller('paginationCtrl', function($scope, $log) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
});

moafControllers.controller('modalCtrl', function($scope, $rootScope, $modal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function(title, image) {
        $scope.image = image
        $scope.title = title;
        var modalInstance = $modal.open({
            templateUrl: 'modal.html',
            controller: 'modalInstCtrl',
            //size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                },
                image: function() {
                    return $scope.image;
                },
                title: function() {
                    return $scope.title;
                }

            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

moafControllers.controller('modalInstCtrl', function($scope, $rootScope, $modalInstance, title, image) {
    $scope.image = image;
    $scope.title = title;

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});