'use strict';

describe('Controller: AddGroupCtrl', function () {

  // load the controller's module
  beforeEach(module('chatYeoApp'));

  var AddGroupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddGroupCtrl = $controller('AddGroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
