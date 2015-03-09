'use strict';
var moafDirectives = angular.module("moafDirectives", [])
var moafControllers = angular.module("moafControllers", []);
var moafServices = angular.module("moafServices", ['ngResource']);
var moafApp = angular.module("moafApp", [
    "ui.bootstrap",
    'ui.filters',
    "ngCookies",
    "ngAnimate",
    "ngGrid",
    "ngRoute",
    "moafControllers",
    "moafServices",
    "moafDirectives"

])

moafDirectives.directive("dragElem", [function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.draggable();
        }
    }
}])
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

moafControllers.controller("mainCtrl", ["$scope", "$rootScope", "$location", "$modal", "moafData", "$log", function($scope, $rootScope, $location, $modal, moafData, $log) {
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


    $rootScope.flipElem = function(event) {
        var parentModal = angular.element(event.target).parents('.modal-content')[0]
        var flipper = angular.element(event.target).parents('div').eq(1).find(".flipper").eq(0);
        angular.element(flipper)[0].style.transform == 'rotateY(180deg)' ? angular.element(flipper)[0].style.transform = '' : angular.element(flipper)[0].style.transform = 'rotateY(180deg)'

    }

    $rootScope.open = function(thisNote) {

        thisNote.relatedNotes = [];
        angular.forEach($rootScope.notes, function(note) {
            if (note.GroupID == thisNote.GroupID && note != thisNote) {
                thisNote.relatedNotes.push(note)
            }
            note.aspect = note.Width / note.Height
            note.aspect > 1.5 ? note.layout = "landscape" : note.layout = "portrait";
        })
        $scope.title = 'title';
        var img = new Image();

        $scope.note = thisNote;
        var modalInstance = $modal.open({
            templateUrl: 'views/collectModal.html',
            controller: 'collModalInstCtrl',
            backdrop: 'static',
            windowClass: thisNote.layout,
            //size: size,
            resolve: {
                note: function() {
                    return $scope.note
                }

            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $rootScope.move = function(dir) {
        switch (dir) {
            case "right":
                $scope.lineLeft -= 400
                break;
            case "left":
                if ($scope.lineLeft < 0) {
                    $scope.lineLeft += 400;
                }
                break;
            case "up":
                $scope.relBottom -= 100;
                break;
            case "down":
                $scope.relTop += 100;
                break;
        }


    }

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

    $rootScope.notes = moafData.query({
        "info": "noteTypeData"
    }).$promise.then(function(result) {
        $scope.noteTypes = $rootScope.noteTypes = result;
        $scope.noteGroups = _.groupBy($scope.noteTypes, "noteEra");
    })

    $scope.lineLeft = 0;

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

moafApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when('/timeline', {
        templateUrl: 'views/timeline',
        controller: 'timelineCtrl'

    }).otherwise({
        templateUrl: 'views/collections',
        controller: 'collectionsCtrl'

    })
}])


moafControllers.controller('paginationCtrl', function($scope) {
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

    $scope.openModal = function(title, image) {
        console.log(image)
        $scope.image = image
        $scope.title = title;
        var modalInstance = $modal.open({
            templateUrl: 'views/genericModal.html',
            controller: 'modalInstCtrl',
            windowClass: 'timeLineModal',
            //size: size,
            resolve: {
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



moafControllers.controller("collectionsCtrl", function($scope, $rootScope, $filter, $log) {
    // Create x2js instance with default config
    function loadXMLDoc(dname) {
        if (window.XMLHttpRequest) {
            var xhttp = new XMLHttpRequest();
        } else {
            var xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET", dname, false);
        xhttp.send();
        return xhttp.responseXML;
    }


    var xmlDoc = loadXMLDoc("moafData/MOAFNotesData.xml");
    var x2js = new X2JS();
    var notesData = x2js.xml2json(xmlDoc);
    $rootScope.notes = notesData.NotesDataTable.NoteInfo
    $scope.shenkmanCollection = [];
    $scope.ExhibitCollection = [];
    $scope.MOAFCollection = [];
    $rootScope.noteTypes = [];
    angular.forEach($rootScope.notes, function(note, noteIndex) {
        $rootScope.noteTypes.push(note.NoteType)
        if (note.IsShenkmanCollection) {
            $scope.shenkmanCollection.push(note)
        }
        if (note.IsExhibitCollection) {
            $scope.ExhibitCollection.push(note)
        }
        if (note.IsMOAFCollection) {
            $scope.MOAFCollection.push(note)
        }
    })


    $rootScope.noteTypes = _.unique($rootScope.noteTypes);
    $scope.collections = {
        "Shenkman Collection": $scope.shenkmanCollection,
        "Exhibit Collection": $scope.ExhibitCollection,
        "MOAF Collection": $scope.MOAFCollection
    }

    $scope.currentCollection = 'shenkmanCollection';
$scope.currentNotes = $scope[$scope.currentCollection]
    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;

    $scope.totalItems = $scope.currentNotes.length;
    $scope.currentNoteType='';
    $scope.filteredNotes = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 6;
    
    $scope.filteredNotes = $scope.currentNotes

    $scope.getTipLoc = function(layout) {
        var loc
        layout == "portrait" ? loc = "left" : loc = "top";
        console.log(loc)
        return loc;
    }
    $scope.numPages = function() {
        return Math.ceil($scope.currentNotes.length / $scope.numPerPage);
    };

    $scope.setPage = function(pageNo) {
        if (pageNo > 0&&pageNo <= $scope.numPages()) {
                 $scope.currentPage = pageNo;
  
        }
        $scope.bigCurrentPage = $scope.currentPage;
    };

    $scope.pageChanged = function() {
        //$log.log('Page changed to: ' + $scope.currentPage);
    };
    $scope.changeType = function(newType) {
        $scope.currentNoteType = newType;
        var filtered = [];
        for (var i = 0; i < $scope[$scope.currentCollection].length; i++) {
                var filteredNote = $scope[$scope.currentCollection][i];
if (filteredNote.NoteType == $scope.currentNoteType) {
                    filtered.push(filteredNote);
                }
            }
                                      $scope.notesByType = filtered;
                                     $scope.currentNotes = $scope.notesByType;
                                     var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.notesByPage = $scope.currentNotes.slice(begin, end);
    }


    moafApp.filter('byNoteType', function() {
        return function(items) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.NoteType == $scope.currentNoteType) {
                    filtered.push(item);
                }
            }
            return filtered;
        };
    })

    $scope.$watch('currentPage + numPerPage', function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.notesByPage = $scope.currentNotes.slice(begin, end);
    });

    $scope.$watch('bigCurrentPage + numPerPage', function() {
        var begin = (($scope.bigCurrentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.notesByPage = $scope.currentNotes.slice(begin, end);
    });
})


moafControllers.controller('collModalCtrl', function($scope, $rootScope, $modal, $log) {

    $rootScope.notes = $scope.$parent.notes;

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

moafControllers.controller('collModalInstCtrl', function($scope, $rootScope, $modalInstance, note) {
    $scope.note = note;


    //     var img = new Image();

    // img.onload = function(){
    //   var height = img.height;
    //   var width = img.width;
    //   width/height>1.5?$scope.aspect = "landscape":$scope.aspect="portrait";
    // console.log($scope.aspect)
    // }

    $scope.zoomNote = function() {

    }
    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});