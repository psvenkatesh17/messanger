'use strict';

describe('Controller: EmployeesCtrl', function () {

  // load the controller's module
  beforeEach(module('instagramApp'));

  var EmployeesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmployeesCtrl = $controller('EmployeesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
