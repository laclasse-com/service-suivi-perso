angular.module( 'suiviApp' )
    .factory( 'Carnets',
              [ '$resource', 'APP_PATH',
                function( $resource, APP_PATH ) {
                    return $resource( APP_PATH + '/api/carnets/:uid_eleve',
                                      { uid_eleve: '@uid_eleve' },
                                      { update: { method: 'PUT' } } );
                } ] );
