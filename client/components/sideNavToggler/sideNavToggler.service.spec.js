'use strict';

describe('Service: sideNavToggler', function () {

  // load the service's module
  beforeEach(module('chatYeoApp'));

  // instantiate service
  var sideNavToggler;
  beforeEach(inject(function (_sideNavToggler_) {
    sideNavToggler = _sideNavToggler_;
  }));

  it('should do something', function () {
    expect(!!sideNavToggler).to.be.true;
  });

});
