angular.module( 'suiviApp' )
    .component( 'trombinoscope',
                { controller: [ '$q', 'URL_ENT', 'APIs',
                                function( $q, URL_ENT, APIs ) {
                                    var ctrl = this;
                                    ctrl.search = '';
                                    ctrl.only_display_contributed_to = false;

                                    var current_user = undefined;

                                    var fix_avatar_url = function( avatar_url ) {
                                        return ( _(avatar_url.match(/^user/)).isNull() ? URL_ENT  + '/': '' ) + avatar_url;
                                    };

                                    APIs.get_current_user()
                                        .then( function( response ) {
                                            current_user = response;

                                            current_user.avatar = fix_avatar_url( current_user.avatar );

                                            return APIs.get_current_user_groups();
                                        } )
                                        .then( function( groups ) {
                                            var classes = _(groups).where({ type: 'CLS' });

                                            if ( current_user.profil_actif.type === 'ELV' ) {
                                                current_user.regroupement = { libelle : classes[0].name };

                                                ctrl.eleves = [ current_user ];
                                            } else {
                                                APIs.get_groups( _.chain( classes )
                                                                 .select( function( regroupement ) {
                                                                     return _(regroupement).has('structure_id') && regroupement.structure_id === current_user.profil_actif.structure_id;
                                                                 } )
                                                                 .pluck( 'id' )
                                                                 .uniq()
                                                                 .value() )
                                                    .then( function success( response ) {
                                                        ctrl.groups = response.data;
                                                        ctrl.eleves = [];

                                                        _(response.data).each( function( regroupement ) {
                                                            regroupement.profs = _.chain(regroupement.users).select( function( user ) { return user.type === 'ENS'; } ).pluck('user_id').value();

                                                            APIs.get_users( _.chain(regroupement.users).select( function( user ) { return user.type === 'ELV'; } ).pluck('user_id').value() )
                                                                .then( function( users ) {
                                                                    ctrl.eleves = ctrl.eleves.concat( _(users.data).map( function( eleve ) {
                                                                        eleve.avatar = fix_avatar_url( eleve.avatar );

                                                                        eleve.regroupement = { id: regroupement.id,
                                                                                               name: regroupement.name,
                                                                                               type: regroupement.type };
                                                                        eleve.etablissement = regroupement.structure_id;
                                                                        eleve.enseignants = regroupement.profs;

                                                                        return eleve;
                                                                    } ) );
                                                                } );
                                                        } );
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
        <li ng:repeat="carnet in $ctrl.contributed_to"><a ui:sref="carnet({uid_eleve: carnet.eleve.id})">{{carnet.eleve.firstname}} {{carnet.eleve.lastname}}</a></li>
    </ul>
</div>

<div class="col-md-8 damier trombinoscope">
    <ul>
        <li class="col-xs-6 col-sm-4 col-md-3 col-lg-2 petite case vert-moins"
            style="background-repeat: no-repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-position-x: center; background-position-y: center; background-size: 100% auto;"
            ng:style="{'background-image': 'url( {{eleve.avatar}} )' }"
            ng:repeat="eleve in $ctrl.eleves | filter:$ctrl.search | orderBy:['regroupement.name', 'lastname']">
            <a class="eleve"
               ui:sref="carnet({uid_eleve: eleve.id})">
                <h5 class="regroupement">{{eleve.regroupement.name}}</h5>

                <div class="full-name">
                    <h4 class="first-name">{{eleve.firstname}}</h4>
                    <h3 class="last-name">{{eleve.lastname}}</h3>
                </div>
            </a>
        </li>
    </ul>
</div>
`
                } );
