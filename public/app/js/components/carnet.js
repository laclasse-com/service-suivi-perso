'use strict';

angular.module( 'suiviApp' )
    .component( 'carnet',
                { bindings: { uid: '<' },
                  template: '<uib-tabset active="0">' +
                  '            <uib-tab index="$index + 1" ng:repeat="onglet in $ctrl.onglets">' +
                  '              <uib-tab-heading>{{onglet.nom}} <button class="btn btn-default" ng:click="$ctrl.popup_onglet( $ctrl.uid, onglet, $ctrl.$onInit )"><span class="glyphicon glyphicon-edit"></span></button></uib-tab-heading>' +
                  '              <onglet uid="$ctrl.uid" onglet="onglet"></onglet>' +
                  '            </uib-tab>' +
                  '            <li><input class="btn btn-default" type="button" ng:click="$ctrl.popup_onglet( $ctrl.uid, null, $ctrl.$onInit )" value="+" /></li>' +
                  '          </uib-tabset>',
                  controller: [ '$uibModal', 'Carnets', 'Onglets', 'Popups',
                                function( $uibModal, Carnets, Onglets, Popups ) {
                                    var ctrl = this;

                                    ctrl.popup_onglet = Popups.onglet;

                                    ctrl.$onInit = function() {
                                        Carnets.get({ uid_eleve: ctrl.uid }).$promise
                                            .then( function success( response ) {
                                                ctrl.carnet = response;

                                                Onglets.query({ uid_eleve: ctrl.uid }).$promise
                                                    .then( function success( response ) {
                                                        ctrl.onglets = response;
                                                    },
                                                           function error( response ) {} );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ]
                } );
