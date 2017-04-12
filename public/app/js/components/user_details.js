'use strict';

angular.module( 'suiviApp' )
    .component( 'userDetails',
                { bindings: { uid: '<',
                              small: '<',
                              showAvatar: '<',
                              showConcernedPeople: '<',
                              showPhones: '<',
                              showEmails: '<',
                              showClasse: '<',
                              showBirthdate: '<' },
                  templateUrl: 'app/js/components/user_details.html',
                  controller: [ 'APIs', 'URL_ENT',
                                function( APIs, URL_ENT ) {
                                    var ctrl = this;

                                    ctrl.URL_ENT  = URL_ENT;

                                    ctrl.$onInit = function() {
                                        APIs.get_user( ctrl.uid )
                                            .then( function( response ) {
                                                ctrl.user = response.data;
                                            } );
                                        if ( ctrl.showConcernedPeople ) {
                                            APIs.query_people_concerned_about( ctrl.uid )
                                            .then( function success( response ) {
                                                ctrl.concerned_people = _(response).groupBy('type');
                                                delete ctrl.concerned_people['Élève'];
                                            },
                                                   function error( response ) {} );
                                        }
                                    };
                                } ]
                } );
