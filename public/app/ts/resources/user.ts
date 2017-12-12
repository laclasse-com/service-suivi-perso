'use strict';

angular.module('suiviApp')
  .factory('User',
  ['$resource', '$rootScope', 'URL_ENT', 'UID',
    function($resource, $rootScope, URL_ENT, UID) {
      return $resource(`${URL_ENT}/api/users/${UID}`,
        { expand: 'true' },
        {
          get: {
            cache: false,
            transformResponse: function(response) {
              let user = angular.fromJson(response);

              user.profil_actif = _(user.profiles).findWhere({ active: true });

              user.is_admin = function() {
                return !_(user.profil_actif).isUndefined()
                  && _(user.profiles)
                    .findWhere({
                      structure_id: user.profil_actif.structure_id,
                      type: 'ADM'
                    }) != undefined;
              };

              return user;
            }
          }
        });
    }]);
