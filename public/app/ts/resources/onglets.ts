angular.module('suiviApp')
  .factory('Onglets',
  ['$resource', 'APP_PATH',
    function($resource, APP_PATH) {
      return $resource(`${APP_PATH}/api/onglets/:id`,
        {
          uid: '@uid',
          uids: '@uids',
          id: '@id',
          nom: '@nom'
        },
        {
          update: { method: 'PUT' }
        });
    }]);
