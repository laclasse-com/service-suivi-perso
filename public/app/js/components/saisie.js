'use strict';

angular.module( 'suiviApp' )
    .component( 'saisie',
                { bindings: { uidEleve: '<',
                              onglet: '<',
                              saisie: '=',
                              saisies: '=',
                              edition: '=',
                              showAuthor: '<' },
                  templateUrl: 'app/js/components/saisie.html',
                  controller: [ '$sce', 'Saisies', 'User',
                                function( $sce, Saisies, User ) {
                                    var ctrl = this;

                                    ctrl.toggle_edit = function() {
                                        ctrl.edition = !ctrl.edition;

                                        if ( !ctrl.edition ) {
                                            ctrl.saisie.trusted_contenu = $sce.trustAsHtml( ctrl.saisie.contenu );
                                        }
                                    };

                                    ctrl.cancel = function() {
                                        ctrl.toggle_edit();
                                    };

                                    ctrl.save = function() {
                                        ctrl.saisie.uid_eleve = ctrl.uidEleve;

                                        var promise = ctrl.new_saisie ? ctrl.saisie.$save() : ctrl.saisie.$update();

                                        promise.then( function success( response ) {
                                            if ( ctrl.new_saisie ) {
                                                ctrl.saisies.push( response );

                                                new_saisie();
                                            } else {
                                                ctrl.toggle_edit();
                                            }
                                        },
                                                      function error( response ) { console.log( response ) });
                                    };

                                    ctrl.delete = function() {
                                        swal({ title: 'Êtes-vous sur ?',
                                               text: "La saisie sera définitivement supprimée !",
                                               type: 'warning',
                                               showCancelButton: true,
                                               confirmButtonColor: '#3085d6',
                                               confirmButtonText: 'Oui, je confirme !',
                                               cancelButtonColor: '#d33',
                                               cancelButtonText: 'Annuler'
                                             })
                                            .then( function() {
                                                ctrl.saisie.$delete();
                                            } );
                                    };

                                    var new_saisie = function() {
                                        ctrl.new_saisie = true;
                                        ctrl.saisie = new Saisies({ new_saisie: true,
                                                                    uid_eleve: ctrl.uidEleve,
                                                                    onglet_id: ctrl.onglet.id,
                                                                    contenu: '' });
                                    };

                                    ctrl.$onInit = function() {
                                        if ( ctrl.saisie.create_me ) {
                                            new_saisie();
                                        } else {
                                            ctrl.saisie = new Saisies( ctrl.saisie );
                                            ctrl.saisie.trusted_contenu = $sce.trustAsHtml( ctrl.saisie.contenu );
                                        }

                                        User.get().$promise
                                            .then( function( current_user ) {
                                                ctrl.editable = current_user.is_admin() || ( ctrl.onglet.writable && ctrl.saisie.uid_author === current_user.uid );
                                                ctrl.edition = _(ctrl).has('edition') ? ctrl.edition : false;
                                        } );
                                    };
                                } ]
                } );
