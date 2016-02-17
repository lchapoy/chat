'use strict';

describe('Directive: loadDrawing', function () {

  // load the directive's module
  beforeEach(module('chatYeoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<load-drawing></load-drawing>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the loadDrawing directive');
  }));
});
