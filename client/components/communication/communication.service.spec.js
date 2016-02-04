'use strict';

describe('Service: communication', function () {

  // load the service's module
  beforeEach(module('chatYeoApp'));

  // instantiate service
  var communication;
  beforeEach(inject(function (_communication_) {
    communication = _communication_;
  }));

  it('should do something', function () {
    expect(!!communication).to.be.true;
  });

});
