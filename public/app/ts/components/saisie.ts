'use strict';

angular.module( 'suiviApp' )
    .component( 'saisie',
                { bindings: { uidEleve: '<',
                              onglet: '<',
                              saisie: '=',
                              callback: '&' },
                  controller: [ '$sce', 'Saisies', 'APIs',
                                function( $sce, Saisies, APIs ) {
                                    let ctrl = this;

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
                                        if ( !_(ctrl.saisie).has('$save') ) {
                                            ctrl.saisie.onglet_id = ctrl.onglet.id;
                                            ctrl.saisie.uid_eleve = ctrl.uidEleve;

                                            ctrl.saisie = new Saisies( ctrl.saisie );
                                        }
                                        let promise = ctrl.new_saisie ? ctrl.saisie.$save() : ctrl.saisie.$update();

                                        promise.then( function success( response ) {
                                            if ( !ctrl.new_saisie ) {
                                                ctrl.toggle_edit();
                                            }
                                            ctrl.saisie.action = ctrl.new_saisie ? 'created' : 'updated';
                                            ctrl.callback();
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
                                                ctrl.saisie.$delete()
                                                    .then( function(  ) {
                                                        ctrl.saisie.action = 'deleted';
                                                        ctrl.callback();
                                                    });
                                            } );
                                    };

                                    ctrl.$onInit = function() {
                                        ctrl.edition = ctrl.saisie.create_me;

                                        if ( ctrl.saisie.create_me ) {
                                            ctrl.new_saisie = true;
                                            ctrl.saisie.contenu = '';
                                        } else {
                                            ctrl.saisie = new Saisies( ctrl.saisie );
                                        }
                                        ctrl.saisie.uid_eleve = ctrl.uidEleve;
                                        ctrl.saisie.trusted_contenu = $sce.trustAsHtml( ctrl.saisie.contenu );

                                        APIs.get_current_user()
                                            .then( function( current_user ) {
                                                ctrl.current_user = current_user;
                                                ctrl.editable = ctrl.onglet.writable && ctrl.saisie.uid_author === ctrl.current_user.id;
                                            } );
                                    };

                                    ctrl.$onChanges = function( changes ) {
                                        ctrl.saisie.uid_eleve = ctrl.uidEleve;
                                        ctrl.saisie.trusted_contenu = $sce.trustAsHtml( ctrl.saisie.contenu );
                                    };
                                } ],
                  template: `
<div class="panel panel-default saisie-display">
    <div class="panel-heading" ng:if="$ctrl.saisie.id">
        <user-details class="col-md-4"
                      ng:if="!$ctrl.saisie.new_saisie"
                      uid="$ctrl.saisie.uid_author"
                      small="true"
                      show-avatar="true"></user-details>
        {{$ctrl.saisie.date_creation | date:'medium'}}
        <div class="clearfix"></div>
    </div>

    <div class="panel-body" ng:style="{'padding': $ctrl.new_saisie ? 0 : 'inherit', 'border': $ctrl.new_saisie ? 0 : 'inherit'}">

        <div class="col-md-12"
             ng:bind-html="$ctrl.saisie.trusted_contenu"
             ng:if="!$ctrl.edition"></div>

        <div class="col-md-12"
             ng:style="{'padding': $ctrl.new_saisie ? 0 : 'inherit'}"
             ng:if="$ctrl.edition">
            <text-angular ta:target-toolbars="main-ta-toolbar-{{$ctrl.onglet.id}}-{{$ctrl.saisie.id}}"
                          ng:model="$ctrl.saisie.contenu"
                          ng:change="$ctrl.dirty = true"></text-angular>
            <div class="suivi-ta-toolbar gris2-moins">
                <text-angular-toolbar class="pull-left"
                                      style="margin-left: 0;"
                                      name="main-ta-toolbar-{{$ctrl.onglet.id}}-{{$ctrl.saisie.id}}"></text-angular-toolbar>
                <button class="btn btn-success pull-right"
                        ng:disabled="!$ctrl.dirty"
                        ng:click="$ctrl.save()">
                    <span class="glyphicon glyphicon-save" ></span> Publier
                </button>
                <button class="btn btn-default pull-right"
                        ng:click="$ctrl.cancel()"
                        ng:if="$ctrl.saisie.id">
                    <span class="glyphicon glyphicon-edit" ></span> Annuler
                </button>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>

    <div class="panel-footer" ng:if="!$ctrl.edition">
        <div class="pull-right buttons">
            <button class="btn btn-default"
                    ng:click="$ctrl.toggle_edit()"
                    ng:if="$ctrl.editable">
                <span class="glyphicon glyphicon-edit" ></span> Éditer
            </button>

            <button class="btn btn-danger"
                    ng:click="$ctrl.delete()"
                    ng:if="$ctrl.saisie.id && ( $ctrl.editable || $ctrl.current_user.is_admin() )">
                <span class="glyphicon glyphicon-trash"></span> Supprimer
            </button>
        </div>
        <div class="clearfix"></div>
    </div>
</div>
`
                } );
