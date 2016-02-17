'use strict';

describe('Directive: colorPicker', function () {

  // load the directive's module and view
  beforeEach(module('chatYeoApp'));
  beforeEach(module('components/colorPicker/colorPicker.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<color-picker></color-picker>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the colorPicker directive');
  }));
});
