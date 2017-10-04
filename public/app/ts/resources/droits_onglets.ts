angular.module('suiviApp')
  .factory('DroitsOnglets',
  ['$resource', 'APP_PATH',
    function($resource, APP_PATH) {
      return $resource(`${APP_PATH}/api/droits/:id`,
        {
          onglet_id: '@onglet_id',
          onglets_ids: '@onglets_ids',
          id: '@id',
          uid: '@uid',
          profil_id: '@profil_id',
          sharable_id: '@sharable_id',
          read: '@read',
          write: '@write',
          manage: '@manage'
        },
        {
          update: { method: 'PUT' }
        });
    }]);
