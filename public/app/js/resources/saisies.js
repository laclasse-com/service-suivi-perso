angular.module('suiviApp')
    .factory('Saisies', ['$resource', 'APP_PATH',
    function ($resource, APP_PATH) {
        return $resource(APP_PATH + '/api/carnets/:uid_eleve/onglets/:onglet_id/saisies/:id', { uid_eleve: '@uid_eleve',
            onglet_id: '@onglet_id',
            id: '@id',
            contenu: '@contenu' }, { update: { method: 'PUT' } });
    }]);
