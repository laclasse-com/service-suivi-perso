angular.module('suiviApp')
  .factory('Onglets',
  ['$resource', 'APP_PATH',
    function($resource, APP_PATH) {
      return $resource(`${APP_PATH}/api/onglets/:id`,
        {
          id: '@id'
        },
        {
          save: {
            method: 'POST',
            isArray: true
          },
          update: {
            method: 'PUT',
            isArray: true
          }
        });
    }]);