angular.module('suiviApp')
  .factory('Onglets',
  ['$resource', 'APP_PATH',
    function($resource, APP_PATH) {
      return $resource(`${APP_PATH}/api/onglets/:id`,
        {
          uid_eleve: '@uid_eleve',
          id: '@id',
          nom: '@nom'
        },
        {
          update: { method: 'PUT' }
        });
    }]);
