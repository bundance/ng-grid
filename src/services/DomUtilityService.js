/// <reference path="../../lib/jquery-1.8.2.min" />
/// <reference path="../../lib/angular.js" />
/// <reference path="../constants.js"/>
/// <reference path="../namespace.js" />
/// <reference path="../navigation.js"/>
/// <reference path="../utils.js"/>
/// <reference path="../classes/range.js"/>
ngGridServices.factory('DomUtilityService', function () {
    var domUtilityService = {};
    domUtilityService.AssignGridContainers = function (rootEl, grid) {
        grid.$root = rootEl;
        //Headers
        grid.$topPanel = angular.element(grid.$root.children()[0]);
        grid.$groupPanel = angular.element(grid.$topPanel.children()[0]);
        grid.$headerContainer = angular.element(grid.$topPanel.children()[1]);
        grid.$headerScroller = angular.element(grid.$headerContainer.children()[0]);;
        grid.$headers = grid.$headerScroller.children();
        //Viewport
        grid.$viewport = angular.element(grid.$root.children()[1]);
        //Canvas
        grid.$canvas = angular.element(grid.$viewport.children()[0]);;
        //Footers
        grid.$footerPanel = angular.element(grid.$root.children()[2]);
        domUtilityService.UpdateGridLayout(grid);
    };
	domUtilityService.UpdateGridLayout = function(grid) {
		// first check to see if the grid is hidden... if it is, we will screw a bunch of things up by re-sizing
		if (grid.$root.parent()[0].style.display == "none") {
			return;
		}
		//catch this so we can return the viewer to their original scroll after the resize!
		var scrollTop = grid.$viewport.scrollTop;
		grid.elementDims.rootMaxW = grid.$root[0].offsetWidth;
		grid.elementDims.rootMaxH = grid.$root[0].offsetHeight;
		//check to see if anything has changed
		grid.refreshDomSizes();
		grid.adjustScrollTop(scrollTop, true); //ensure that the user stays scrolled where they were
	};
    domUtilityService.BuildStyles = function($scope, grid, apply) {
        var rowHeight = grid.config.rowHeight,
            gridId = grid.gridId,
            css,
            cols = $scope.visibleColumns(),
            sumWidth = 0;
        
        if (!grid.$styleSheet) {
            grid.$styleSheet = angular.element("<style type='text/css' rel='stylesheet' />")
            angular.element(window.document.body).append(grid.$styleSheet);
        }
        grid.$styleSheet.html('');
        var trw = $scope.totalRowWidth();
        css = "." + gridId + " .ngCanvas { width: " + trw + "px; }"+
              "." + gridId + " .ngRow { width: " + trw + "px; }" +
              "." + gridId + " .ngCell { height: " + rowHeight + "px; }"+
              "." + gridId + " .ngCanvas { width: " + trw + "px; }" +
              "." + gridId + " .ngHeaderCell { top: 0; bottom: 0; }" + 
              "." + gridId + " .ngHeaderScroller { width: " + (trw + domUtilityService.scrollH + 2) + "px}";
        angular.forEach(cols, function(col, i) {
            css += "." + gridId + " .col" + i + " { width: " + col.width + "px; left: " + sumWidth + "px; right: " + (trw - sumWidth - col.width) + "px; height: " + rowHeight + "px }" +
                   "." + gridId + " .colt" + i + " { width: " + col.width + "px; }";
            sumWidth += col.width;
        });
        if (ng.utils.isIe) { // IE
            grid.$styleSheet[0].styleSheet.cssText = css;
        } else {
            grid.$styleSheet.append(document.createTextNode(css));
        }
        if (apply) domUtilityService.apply($scope);
    };
	
    domUtilityService.apply = function($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    domUtilityService.ScrollH = 17; // default in IE, Chrome, & most browsers
    domUtilityService.ScrollW = 17; // default in IE, Chrome, & most browsers
    domUtilityService.LetterW = 10;
	return domUtilityService;
});