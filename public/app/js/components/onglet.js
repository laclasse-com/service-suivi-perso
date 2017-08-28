'use strict';

angular.module( 'suiviApp' )
    .component( 'onglet',
                { bindings: { uidEleve: '<',
                              onglet: '=' },
                  controller: [ '$uibModal', '$state', 'Onglets', 'Saisies', 'Popups', 'GeneratePDF',
                                function( $uibModal, $state, Onglets, Saisies, Popups, GeneratePDF ) {
                                    var ctrl = this;

                                    ctrl.manage_onglet = Popups.onglet;
                                    ctrl.print_onglet = GeneratePDF.onglet;

                                    ctrl.callback_popup_onglet = function( onglet ) {
                                        if ( onglet.deleted ) {
                                            $state.go( 'carnet',
                                                       { uid_eleve: ctrl.uidEleve },
                                                       { reload: true } );
                                        }
                                    };

                                    ctrl.saisie_callback = function( saisie ) {
                                        switch( saisie.action ) {
                                        case 'created':
                                            ctrl.saisies.push( saisie );
                                            ctrl.saisies.shift();
                                            ctrl.saisies.unshift( { create_me: true, truc: 'bidule' } );
                                            break;
                                        case 'deleted':
                                            ctrl.saisies = _(ctrl.saisies).reject( function( s ) { return s.id === saisie.id; } );
                                            break;
                                        default:
                                            console.log('What to do with this?')
                                            console.log(saisie)
                                        }

                                    };

                                    ctrl.$onInit = function() {
                                        Saisies.query({ uid_eleve: ctrl.uidEleve,
                                                        onglet_id: ctrl.onglet.id }).$promise
                                            .then( function success( response ) {
                                                ctrl.saisies = ctrl.onglet.writable ? [ { create_me: true } ] : [];

                                                ctrl.saisies = ctrl.saisies.concat( response );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ],
                  template: `
<div class="col-md-3 pull-right"
     style="text-align: right;">
    <button class="btn btn-lg btn-warning"
            style="width: 100%;"
            ng:if="$ctrl.onglet.writable"
            ng:click="$ctrl.manage_onglet( $ctrl.uidEleve, $ctrl.onglet, $ctrl.callback_popup_onglet )">
        <span class="glyphicon glyphicon-cog"></span> Configuration de l'onglet
    </button>
    <button class="btn btn-lg btn-primary"
            style="width: 100%;"
            ng:click="$ctrl.print_onglet( $ctrl.uidEleve, $ctrl.onglet )">
        <span class="glyphicon glyphicon-print"></span> Exporter en PDF
    </button>
</div>

<saisie ng:repeat="saisie in $ctrl.saisies"
        class="col-md-9"
        uid-eleve="$ctrl.uidEleve"
        onglet="$ctrl.onglet"
        saisie="saisie"
        callback="$ctrl.saisie_callback( saisie )"></saisie>
`
                } );
