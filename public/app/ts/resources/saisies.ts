angular.module( 'suiviApp' )
  .factory( 'Saisies',
  [ '$resource', 'APP_PATH',
    function ( $resource, APP_PATH ) {
      return $resource( `${ APP_PATH }/api/saisies/:id`,
        {
          id: '@id',
          onglet_id: '@onglet_id',
          contenu: '@contenu'
        },
        {
          update: { method: 'PUT' }
        } );
    }] );
