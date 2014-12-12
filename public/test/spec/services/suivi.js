'use strict';

describe('Service: Suivi', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var Suivi;
  beforeEach(inject(function (_Suivi_) {
    Suivi = _Suivi_;
  }));

  it('should do something', function () {
    expect(!!Suivi).toBe(true);
  });

});
