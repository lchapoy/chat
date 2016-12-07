'use strict';

describe('Directive: repeatMessages', function () {

  // load the directive's module and view
  beforeEach(module('chatYeoApp'));
  beforeEach(module('components/repeatMessages/repeatMessages.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<repeat-messages></repeat-messages>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the repeatMessages directive');
  }));
});
