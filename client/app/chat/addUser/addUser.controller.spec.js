'use strict';

describe('Controller: AddUserCtrl', function () {

  // load the controller's module
  beforeEach(module('chatYeoApp'));

  var AddUserCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddUserCtrl = $controller('AddUserCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
