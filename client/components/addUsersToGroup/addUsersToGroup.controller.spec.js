'use strict';

describe('Controller: AddUsersToGroupCtrl', function () {

  // load the controller's module
  beforeEach(module('chatYeoApp'));

  var AddUsersToGroupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddUsersToGroupCtrl = $controller('AddUsersToGroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
