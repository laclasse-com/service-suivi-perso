angular.module( 'suiviApp' )
    .component( 'trombinoscope',
                { templateUrl: 'app/js/components/trombinoscope.html',
                  controller: [ '$q', 'URL_ENT', 'APIs',
                                function( $q, URL_ENT, APIs ) {
                                    var ctrl = this;
                                    ctrl.search = '';
                                    ctrl.only_display_contributed_to = false;

                                    var fix_avatar_url = function( avatar_url ) {
                                        return ( _(avatar_url.match(/^user/)).isNull() ? URL_ENT : '' ) + avatar_url;
                                    };

                                    APIs.get_current_user()
                                        .then( function( current_user ) {
                                            current_user.avatar = fix_avatar_url( current_user.avatar );

                                            if ( current_user.profil_actif.profil_id === 'ELV' ) {
                                                current_user.regroupement = { libelle : current_user.classes[0].classe_libelle };

                                                ctrl.eleves = [ current_user ];
                                            } else {
                                                $q.all( _.chain( current_user.classes )
                                                        .select( function( regroupement ) {
                                                            return _(regroupement).has('etablissement_code') && regroupement.etablissement_code === current_user.profil_actif.etablissement_code_uai;
                                                        } )
                                                        .map( function( regroupement ) {
                                                            return _(regroupement).has('classe_id') ? regroupement.classe_id : regroupement.groupe_id;
                                                        } )
                                                        .uniq()
                                                        .map( function( regroupement_id ) {
                                                            return APIs.get_regroupement( regroupement_id );
                                                        } )
                                                        .value()
                                                      )
                                                    .then( function success( response ) {
                                                        ctrl.eleves = _.chain(response)
                                                            .pluck('data')
                                                            .map( function( regroupement ) {
                                                                return _(regroupement.eleves)
                                                                    .map( function( eleve ) {
                                                                        eleve.avatar = fix_avatar_url( eleve.avatar );

                                                                        eleve.regroupement = { id: regroupement.id,
                                                                                               libelle: regroupement.libelle_aaf,
                                                                                               type: regroupement.type_regroupement_id };
                                                                        eleve.etablissement = regroupement.etablissement;
                                                                        eleve.enseignants = regroupement.profs;

                                                                        return eleve;
                                                                    } );
                                                            } )
                                                            .flatten()
                                                            .value();

                                                        APIs.query_carnets_contributed_to( current_user.id_ent )
                                                            .then( function success( response ) {
                                                                ctrl.eleves_contributed = _.chain(response.data).map( function( carnet ) {
                                                                    return _(ctrl.eleves).findWhere({ id_ent: carnet.uid_eleve });
                                                                }).compact().value();
                                                            },
                                                                   function error( response ) {} );
                                                    },
                                                           function error( response ) {} );
                                            }
                                        } );
                                } ]
                } );
