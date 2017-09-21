angular.module( 'suiviApp' )
  .component( 'trombinoscope',
  {
    controller: [ '$q', 'URL_ENT', 'APIs',
      function( $q, URL_ENT, APIs ) {
        let ctrl = this;
        ctrl.search = '';
        ctrl.only_display_contributed_to = false;
        ctrl.eleves = [];

        let current_user = undefined;

        let fix_avatar_url = function( avatar_url ) {
          return ( _( avatar_url.match( /^(user|http)/ ) ).isNull() ? `${ URL_ENT }/` : '' ) + avatar_url;
        };

        APIs.get_current_user()
          .then( function( response ) {
            current_user = response;

            current_user.avatar = fix_avatar_url( current_user.avatar );

            return APIs.get_current_user_groups();
          } )
          .then( function( groups ) {
            let classes = _( groups ).where( { type: 'CLS' } );

            if ( current_user.profil_actif.type === 'ELV' ) {
              current_user.regroupement = { libelle: classes[ 0 ].name };

              ctrl.eleves = [ current_user ];
            } else if ( current_user.profil_actif.type === 'TUT' ) {
              let users_ids = _( current_user.children ).pluck( 'child_id' );

              if ( !_( users_ids ).isEmpty() ) {
                APIs.get_users( users_ids )
                  .then( function( users ) {
                    ctrl.eleves = ctrl.eleves.concat( _( users.data ).map( function( eleve ) {
                      eleve.avatar = fix_avatar_url( eleve.avatar );
                      let groups_ids = _( eleve.groups ).pluck( 'group_id' );

                      if ( !_( groups_ids ).isEmpty() ) {
                        APIs.get_groups( groups_ids )
                          .then( function( response ) {
                            let regroupement = _( response.data ).findWhere( { type: 'CLS' } );

                            if ( !_( regroupement ).isUndefined() ) {
                              eleve.regroupement = {
                                id: regroupement.id,
                                name: regroupement.name,
                                type: regroupement.type
                              };
                              eleve.etablissement = regroupement.structure_id;
                              eleve.enseignants = regroupement.profs;
                            }
                          } );
                      }

                      return eleve;
                    } ) );
                  } );
              }
            } else {
              APIs.get_groups( _.chain( classes )
                .select( function( regroupement ) {
                  return _( regroupement ).has( 'structure_id' ) && regroupement.structure_id === current_user.profil_actif.structure_id;
                } )
                .pluck( 'id' )
                .uniq()
                .value() )
                .then( function success( response ) {
                  ctrl.groups = response.data;
                  ctrl.eleves = [];

                  _( response.data ).each( function( regroupement ) {
                    regroupement.profs = _.chain( regroupement.users ).select( function( user ) { return user.type === 'ENS'; } ).pluck( 'user_id' ).value();
                    let users_ids = _.chain( regroupement.users ).select( function( user ) { return user.type === 'ELV'; } ).pluck( 'user_id' ).value();

                    APIs.get_users( users_ids )
                      .then( function( users ) {
                        ctrl.eleves = ctrl.eleves.concat( _( users.data ).map( function( eleve ) {
                          eleve.avatar = fix_avatar_url( eleve.avatar );

                          eleve.regroupement = {
                            id: regroupement.id,
                            name: regroupement.name,
                            type: regroupement.type
                          };
                          eleve.etablissement = regroupement.structure_id;
                          eleve.enseignants = regroupement.profs;

                          return eleve;
                        } ) );
                      } );
                  } );
                },
                function error( response ) { } );
            }

            APIs.query_carnets_contributed_to( current_user.id )
              .then( function success( response ) {
                ctrl.contributed_to = response.data;
              },
              function error( response ) { } );
          } );
      }],
    template: `
      <div class="col-md-4 blanc aside" style="padding: 0;">
        <div class="search-filter" style="padding: 20px; background-color: #baddad;">
          <label for="search"> Filtrage des élèves affichés : </label>
          <input  class="form-control input-sm"
                  style="display: inline; max-width: 300px;"
                  type="text" name="search"
                  ng:model="$ctrl.search" />
          <button class="btn btn-sm" style="margin-left: -5px;"
                  ng:click="$ctrl.search = ''">
            <span class="glyphicon glyphicon-remove">
            </span>
          </button>
        </div>

        <div class="group-filter" style="padding: 20px; background-color: #baddad;" ng:if="$ctrl.groups.length > 0">
          <label> Filtrage par classe : </label>
          <button class="btn btn-sm" style="margin: 2px;"
                  ng:repeat="group in $ctrl.groups"
                  ng:click="$ctrl.search = group.name;">{{group.name}}</button>
        </div>

        <div class="highlighted" style="padding: 20px;">
          <label ng:if="$ctrl.contributed_to.length > 0"> Carnet<span ng:if="$ctrl.contributed_to.length > 1">s</span>
          <span ng:if="$ctrl.contributed_to.length > 1">auxquels</span>
          <span ng:if="$ctrl.contributed_to.length < 2">auquel</span> vous avez contribué : </label>
          <ul>
            <li ng:repeat="carnet in $ctrl.contributed_to" style="list-style-type: none;">
              <a ui:sref="carnet({uid_eleve: carnet.uid_eleve})">
                <user-details uid="carnet.uid_eleve"
                              small="true"
                              show-classe="true"
                              show-avatar="true">
                </user-details>
              </a>
            </li>
          </ul>
        </div>
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
