(function () {
  "use strict";

  const app = angular.module("legacyApp", []);

  app.controller("MainController", function () {
    var vm = this;
    vm.isLoggedIn = false;

    vm.login = function () {
      vm.isLoggedIn = true;
    };

    vm.logout = function () {
      vm.isLoggedIn = false;
    };
  });

  app.directive("lunchDashboard", function () {
    return {
      restrict: "E",
      scope: {},
      link: function (scope, element) {
        if (!window.LunchDashboard) {
          element.html('<div style="padding: 20px; color: red; border: 1px solid red; margin: 10px;">LunchDashboard component not available. Please check if the React build is properly loaded.</div>');
          return;
        }

        const { mountLunchDashboard } = window.LunchDashboard;
        let unmount = null;

        try {
          unmount = mountLunchDashboard(element[0]);
        } catch (error) {
          element.html('<div style="padding: 20px; color: red; border: 1px solid red; margin: 10px;">Failed to load dashboard. Error: ' + error.message + '</div>');
        }

        // Cleanup on scope destroy
        scope.$on('$destroy', function() {
          if (unmount) {
            try {
              unmount();
            } catch (error) {
              console.error('Failed to unmount LunchDashboard:', error);
            }
          }
        });
      },
    };
  });
})();