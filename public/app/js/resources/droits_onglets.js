angular.module( 'suiviApp' )
    .factory( 'DroitsOnglets',
              [ '$resource', 'APP_PATH',
                function( $resource, APP_PATH ) {
                    return $resource( APP_PATH + '/api/carnets/:uid_eleve/onglets/:onglet_id/droits/:id',
                                      { uid_eleve: '@uid_eleve',
                                        onglet_id: '@onglet_id',
                                        id: '@id',
                                        uid: '@uid',
                                        profil_id: '@profil_id',
                                        read: '@read',
                                        write: '@write' } );
                } ] );
