'use strict';

describe('Service: eventNotify', function () {

  // load the service's module
  beforeEach(module('chatYeoApp'));

  // instantiate service
  var eventNotify;
  beforeEach(inject(function (_eventNotify_) {
    eventNotify = _eventNotify_;
  }));

  it('should do something', function () {
    expect(!!eventNotify).to.be.true;
  });

});
