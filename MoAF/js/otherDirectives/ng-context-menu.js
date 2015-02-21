/**
 * ng-context-menu - v0.1.1 - An AngularJS directive to display a context menu when a right-click event is triggered
 *
 * @author Ian Kennington Walter (http://ianvonwalter.com)
 */
angular
  .module('ng-context-menu', [])
  .factory('ContextMenuService', function() {
    return {
      menuElement: null
    };
  })
  .directive('contextMenu', ['$window', '$parse', 'ContextMenuService', function($window, $parse, ContextMenuService) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var opened = false,
          openTarget, elemId,
          disabled = $scope.$eval(attrs.contextMenuDisabled),
          win = angular.element($window),
          fn = $parse(attrs.contextMenu);

        function open(event, element) {
         
         //assign current scope contextmenu to 'root' context
        $scope.mpp.mppContextMenu = $scope.mppContextMenu
        $scope.showElemInfo=!$scope.showElemInfo
          element.addClass('open');
          element.css('top', Math.max(event.pageY-85, 0) + 'px');
          element.css('left', Math.max(event.pageX, 0) + 'px');
          element.css('z-index', 111111111);
          opened = true;
        }

        function close(element) {
          opened = false;
          element.removeClass('open');
        }

        element.bind('contextmenu', function(event) {
          if (!disabled) {
            if (ContextMenuService.menuElement !== null) {
              close(ContextMenuService.menuElement);
            }
            ContextMenuService.menuElement = angular.element(document.getElementById(attrs.target));
            openTarget = event.target;

            //get the index of the right-clicked elements parent row relative to the grid canvas
            var mCanvas =angular.element(openTarget).parents('.ngCanvas').eq(0)
            var mRow =angular.element(openTarget).parents('.ngRow').eq(0)
            $scope.mpp.selectedId = mRow.find('.elemId').text()
            $scope.mpp.rtClkIndex = mRow.index()
            event.preventDefault();
            event.stopPropagation();
            $scope.$apply(function() {
              fn($scope, { $event: event });
              open(event, ContextMenuService.menuElement);
            });
          }
        });

        win.bind('keyup', function(event) {
          if (!disabled && opened && event.keyCode === 27) {
            $scope.$apply(function() {
              close(ContextMenuService.menuElement);
            });
          }
        });

        function handleWindowClickEvent(event) {
          //keep context menu on click if it is a element edit menu
       var isEditMenu = angular.element(event.target).parents('#objEditMenu').length
          if (!disabled && opened && (event.button !== 2 || event.target !== openTarget) && !isEditMenu) {
            $scope.$apply(function() {
              close(ContextMenuService.menuElement);
            });
          }
        }

        // Firefox treats a right-click as a click and a contextmenu event while other browsers
        // just treat it as a contextmenu event
        win.bind('click', handleWindowClickEvent);
        win.bind('contextmenu', handleWindowClickEvent);
      }
    };
  }]);
