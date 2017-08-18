angular.module( 'suiviApp' )
    .component( 'trombinoscope',
                { controller: [ '$q', 'URL_ENT', 'APIs',
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
                                                    },
                                                           function error( response ) {} );
                                            }

                                            APIs.query_carnets_contributed_to( current_user.id )
                                                .then( function success( response ) {
                                                    ctrl.contributed_to = response.data;
                                                    _(ctrl.contributed_to).each( function( carnet ) {
                                                        APIs.get_user( carnet.uid_eleve )
                                                            .then( function success( response ) {
                                                                carnet.eleve = response.data;
                                                            },
                                                                   function error( response ) {} );
                                                    });
                                                },
                                                       function error( response ) {} );
                                        } );
                                } ],
                  template: `
<div class="col-md-4 blanc aside">
    <label for="search"> Filtrage des élèves affichés : </label>
    <input  class="form-control input-sm"
            style="display: inline; max-width: 300px;"
            type="text" name="search"
            ng:model="$ctrl.search" />

    <label ng:if="contributed_to.length > 0"> Carnet<span ng:if="contributed_to.length > 1">s</span> <span ng:if="contributed_to.length > 1">auxquels</span><span ng:if="contributed_to.length < 2">auquel</span> vous avez contribué : </label>
    <ul>
        <li ng:repeat="carnet in $ctrl.contributed_to"><a ui:sref="carnet({uid_eleve: carnet.eleve.id_ent})">{{carnet.eleve.prenom}} {{carnet.eleve.nom}}</a></li>
    </ul>
</div>

<div class="col-md-8 damier trombinoscope">
    <ul>
        <li class="col-xs-6 col-sm-4 col-md-3 col-lg-2 petite case vert-moins"
            style="background-repeat: no-repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-position-x: center; background-position-y: center; background-size: 100% auto;"
            ng:style="{'background-image': 'url( {{eleve.avatar}} )' }"
            ng:repeat="eleve in $ctrl.eleves | filter:search">
            <a class="eleve"
               ui:sref="carnet({uid_eleve: eleve.id_ent})">
                <h5 class="regroupement">{{eleve.regroupement.libelle}}</h5>

                <div class="full-name">
                    <h4 class="first-name">{{eleve.prenom}}</h4>
                    <h3 class="last-name">{{eleve.nom}}</h3>
                </div>
            </a>
        </li>
    </ul>
</div>
`
                } );
