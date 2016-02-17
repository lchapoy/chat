'use strict';

describe('Directive: canvasDrawing', function () {

  // load the directive's module and view
  beforeEach(module('chatYeoApp'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<canvas-drawing></canvas-drawing>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the canvasDrawing directive');
  }));
});
