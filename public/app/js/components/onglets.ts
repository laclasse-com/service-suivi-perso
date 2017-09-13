'use strict';

angular.module( 'suiviApp' )
    .component( 'onglets',
                { bindings: { uidEleve: '<' },
                  controller: [ '$uibModal', 'Carnets', 'Onglets', 'Popups',
                                function( $uibModal, Carnets, Onglets, Popups ) {
                                    var ctrl = this;
                                    ctrl.popup_onglet = Popups.onglet;

                                    ctrl.callback_popup_onglet = function( onglet ) {
                                        if ( onglet.created ) {
                                            ctrl.onglets.push( onglet );
                                        }
                                    };

                                    ctrl.$onInit = function() {
                                        Carnets.get({ uid_eleve: ctrl.uidEleve }).$promise
                                            .then( function success( response ) {
                                                ctrl.carnet = response;

                                                Onglets.query({ uid_eleve: ctrl.uidEleve }).$promise
                                                    .then( function success( response ) {
                                                        ctrl.onglets = response;
                                                    },
                                                           function error( response ) {} );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ],
                  template: `
<uib-tabset>
    <uib-tab ng:repeat="onglet in $ctrl.onglets">
        <uib-tab-heading> {{onglet.nom}} </uib-tab-heading>

        <onglet uid-eleve="$ctrl.uidEleve"
                onglets="$ctrl.onglets"
                onglet="onglet"></onglet>
    </uib-tab>

    <li>
        <a href
           class="bleu add-onglet"
           ng:click="$ctrl.popup_onglet( $ctrl.uidEleve, null, $ctrl.onglets, $ctrl.callback_popup_onglet )">
            <span class="glyphicon glyphicon-plus"></span>
        </a>
    </li>
</uib-tabset>
`
                } );
