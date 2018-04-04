angular.module('suiviApp')
  .factory('Saisies',
  ['$resource', 'APP_PATH',
    function($resource, APP_PATH) {
      return $resource(`${APP_PATH}/api/saisies/:id`,
        {
          id: '@id'
        },
        {
          update: { method: 'PUT' }
        });
    }]);
