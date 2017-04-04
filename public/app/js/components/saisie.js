'use strict';

angular.module( 'suiviApp' )
    .component( 'saisie',
                { bindings: { uid: '<',
                              onglet: '<',
                              saisie: '<' },
                  template: '<fieldset>' +
                  '            <legend>{{$ctrl.saisie.uid}}</legend>' +
                  '            <h6>{{$ctrl.saisie.date_creation}}</h6>' +
                  '            <div>{{$ctrl.saisie.contenu}}</div>' +
                  '          </fieldset>',
                  controller: [ function() {
                      var ctrl = this;

                      ctrl.$onInit = function() {};
                  } ]
                } );
