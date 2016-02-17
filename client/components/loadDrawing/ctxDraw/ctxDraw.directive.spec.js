'use strict';

describe('Directive: ctxDraw', function () {

  // load the directive's module
  beforeEach(module('chatYeoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ctx-draw></ctx-draw>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the ctxDraw directive');
  }));
});
