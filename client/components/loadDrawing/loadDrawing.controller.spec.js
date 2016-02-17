'use strict';

describe('Controller: LoadDrawingCtrl', function () {

  // load the controller's module
  beforeEach(module('chatYeoApp'));

  var LoadDrawingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoadDrawingCtrl = $controller('LoadDrawingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
