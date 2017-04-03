'use strict';

angular.module( 'suiviApp' )
    .factory( 'User',
              [ '$resource', '$rootScope', 'URL_ENT', 'UID',
                function( $resource, $rootScope, URL_ENT, UID ) {
                    return $resource( URL_ENT + '/api/app/users/' + UID,
                                      { expand: 'true' },
                                      { get: { cache: false,
                                               transformResponse: function( response ) {
                                                   var user = angular.fromJson( response );

                                                   user.profil_actif = _(user.profils).findWhere({ actif: true });

                                                   user.is_admin = function() {
                                                       return !_(user.profil_actif).isUndefined()
                                                           && ( !_.chain(user.roles)
                                                                .findWhere({ role_id: 'ADM_ETB', etablissement_code_uai: user.profil_actif.etablissement_code_uai })
                                                                .isUndefined()
                                                                .value()
                                                                || !_.chain(user.roles)
                                                                .findWhere({ role_id: 'TECH' })
                                                                .isUndefined()
                                                                .value() );
                                                   };

                                                   return user;
                                               }
                                             }
                                      } );
                } ] );
