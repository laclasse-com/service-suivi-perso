angular.module('suiviApp')
  .factory('Droits',
  ['$resource', 'APP_PATH',
    function($resource, APP_PATH) {
      return $resource(`${APP_PATH}/api/droits/:id`,
        {
          id: '@id'
        },
        {
          save: {
            method: 'POST',
            isArray: true
          },
          update: { method: 'PUT' }
        });
    }]);