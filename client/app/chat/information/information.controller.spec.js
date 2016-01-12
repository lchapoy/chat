'use strict';

describe('Controller: InformationCtrl', function () {

  // load the controller's module
  beforeEach(module('chatYeoApp'));

  var InformationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InformationCtrl = $controller('InformationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
