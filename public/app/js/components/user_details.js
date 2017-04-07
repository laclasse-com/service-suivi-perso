'use strict';

angular.module( 'suiviApp' )
    .component( 'userDetails',
                { bindings: { uid: '<',
                              small: '<',
                              showAvatar: '<',
                              showResponsables: '<',
                              showChildrens: '<',
                              showPhones: '<',
                              showEmails: '<',
                              showClasse: '<',
                              showBirthdate: '<' },
                  templateUrl: 'app/js/components/user_details.html',
                  controller: [ '$http', 'URL_ENT',
                                function( $http, URL_ENT ) {
                                    var ctrl = this;

                                    ctrl.URL_ENT  = URL_ENT;

                                    ctrl.$onInit = function() {
                                        $http.get( URL_ENT + '/api/app/users/' + ctrl.uid, { params: { expand: 'true' } } )
                                            .then( function( response ) {
                                                ctrl.user = response.data;
                                            } );
                                    };
                                } ]
                } );
