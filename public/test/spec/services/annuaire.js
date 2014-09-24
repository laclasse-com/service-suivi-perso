'use strict';

describe('Service: Annuaire', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var Annuaire;
  beforeEach(inject(function (_Annuaire_) {
    Annuaire = _Annuaire_;
  }));

  it('should do something', function () {
    expect(!!Annuaire).toBe(true);
  });

});
