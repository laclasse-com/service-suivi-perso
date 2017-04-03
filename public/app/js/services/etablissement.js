angular.module( 'suiviApp' )
    .service( 'Etablissement',
              [ '$http', 'URL_ENT',
                function( $http, URL_ENT ) {
                    var service = this;

                    service.get = function( uai ) {
                        return $http.get( URL_ENT + '/api/app/v2/etablissements/' + uai );
                    };
                } ] );
