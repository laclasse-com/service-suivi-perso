angular.module( 'suiviApp' )
  .service( 'Popups',
  [ '$uibModal', '$q', 'Onglets',
    function( $uibModal, $q, Onglets ) {
      let service = this;

      service.onglet = function( uid, onglet, all_onglets, callback ) {
        $uibModal.open( {
          resolve: {
            uid: function() { return uid; },
            onglet: function() { return _( onglet ).isNull() ? { nom: '' } : onglet; },
            all_onglets: function() { return all_onglets; }
          },
          controller: [ '$scope', '$uibModalInstance', '$q', 'DroitsOnglets', 'APIs', 'URL_ENT', 'uid', 'onglet', 'all_onglets',
            function PopupOngletCtrl( $scope, $uibModalInstance, $q, DroitsOnglets, APIs, URL_ENT, uid, onglet, all_onglets ) {
              let ctrl = $scope;
              ctrl.$ctrl = ctrl;

              ctrl.uid = uid;
              ctrl.onglet = onglet;
              ctrl.all_onglets = all_onglets;
              ctrl.onglet.delete = false;
              ctrl.valid_name = true;

              if ( _( ctrl.onglet ).has( 'id' ) ) {
                DroitsOnglets.query( {
                  uid_eleve: ctrl.uid,
                  onglet_id: ctrl.onglet.id
                } ).$promise
                  .then( function success( response ) {
                    ctrl.droits = _( response ).map( function( droit ) {
                      droit.uid_eleve = ctrl.uid;
                      droit.own = droit.uid === ctrl.UID;

                      return new DroitsOnglets( droit );
                    } );
                  },
                  function error( response ) { } );
              }

              APIs.get_user( uid )
                .then( function success( response ) {
                  ctrl.eleve = response.data;
                },
                function error( response ) { } );

              APIs.query_people_concerned_about( uid )
                .then( function success( response ) {
                  ctrl.concerned_people = response;
                },
                function error( response ) { } );

              ctrl.name_validation = function() {
                let other_onglets_names = _.chain( ctrl.all_onglets )
                  .reject( function( onglet ) {
                    return !_( ctrl.onglet ).isNull() && ctrl.onglet.id == onglet.id;
                  } )
                  .pluck( 'nom' )
                  .value();

                ctrl.valid_name = !_( other_onglets_names ).includes( ctrl.onglet.nom );

                return ctrl.valid_name;
              };

              ctrl.ok = function() {
                $uibModalInstance.close( {
                  onglet: ctrl.onglet,
                  droits: ctrl.droits
                } );
              };

              ctrl.delete = function() {
                swal( {
                  title: 'Êtes-vous sur ?',
                  text: "L'onglet ainsi que toutes les saisies et droits associés seront définitivement supprimés !",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Oui, je confirme !',
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Annuler'
                } )
                  .then( function() {
                    ctrl.onglet.delete = true;
                    ctrl.ok();
                  } );
              };

              ctrl.cancel = function() {
                $uibModalInstance.dismiss();
              };
            }],
          template: `
<div class="modal-header">
    <h3 class="modal-title">
        Propriétés de l'onglet
    </h3>
</div>

<div class="modal-body">
    <label>Titre : <input type="text" maxlength="45" ng:model="$ctrl.onglet.nom" ng:maxlength="45" ng:change="$ctrl.onglet.dirty = true; $ctrl.name_validation()" />
        <span class="label label-danger" ng:if="!$ctrl.valid_name">Un onglet existant porte déjà ce nom !</span>
    </label>

    <droits-onglets droits="$ctrl.droits"
                    concerned-people="$ctrl.concerned_people"
                    ng:if="$ctrl.onglet.id && $ctrl.droits"></droits-onglets>

    <div class="clearfix"></div>
</div>

<div class="modal-footer">
    <button class="btn btn-danger pull-left"
            ng:click="$ctrl.delete()"
            ng:if="$ctrl.onglet.id">
        <span class="glyphicon glyphicon-trash"></span>
        <span> Supprimer l'onglet</span>
    </button>
    <button class="btn btn-default"
            ng:click="$ctrl.cancel()">
        <span class="glyphicon glyphicon-remove-sign"></span>
        <span ng:if="$ctrl.onglet.nom"> Annuler</span>
        <span ng:if="!$ctrl.onglet.nom"> Fermer</span>
    </button>
    <button class="btn btn-success"
            ng:click="$ctrl.ok()"
            ng:disabled="!$ctrl.onglet.nom || !$ctrl.valid_name">
        <span class="glyphicon glyphicon-ok-sign"></span> Valider
    </button>
</div>
`
        } )
          .result.then( function success( response_popup ) {
            let promise = null;
            let action = 'rien';

            if ( _( onglet ).isNull() ) {
              action = 'created';

              promise = new Onglets( {
                uid_eleve: uid,
                nom: response_popup.onglet.nom
              } ).$save();
            } else {
              response_popup.onglet.uid_eleve = uid;
              if ( response_popup.onglet.delete ) {
                action = 'deleted';

                promise = new Onglets( response_popup.onglet ).$delete();
              } else if ( response_popup.onglet.dirty ) {
                promise = new Onglets( response_popup.onglet ).$update();
              } else {
                promise = $q.resolve( response_popup.onglet );
              }
            }

            promise.then( function success( response ) {
              response.action = action;

              _.chain( response_popup.droits )
                .each( function( droit ) {
                  if ( droit.to_delete ) {
                    if ( _( droit ).has( 'id' ) ) {
                      droit.$delete();
                    }
                  } else if ( droit.dirty
                    && ( droit.uid !== '...' && droit.profil_id !== '...' && droit.sharable_id !== '...' )
                    && _( droit.dirty ).reduce( function( memo, value ) { return memo || value; }, false )
                    && droit.read ) {
                    droit.uid_eleve = uid;
                    droit.onglet_id = response_popup.onglet.id;

                    ( _( droit ).has( 'id' ) ? droit.$update() : droit.$save() );
                  }
                } );

              callback( response );
            },
              function error() { } );
          }, function error() { } );
      };
    }] );
