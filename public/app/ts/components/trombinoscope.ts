angular.module('suiviApp')
  .component('trombinoscope',
  {
    controller: ['$filter', '$q', 'URL_ENT', 'APIs', 'Popups',
      function($filter, $q, URL_ENT, APIs, Popups) {
        let ctrl = this;

        ctrl.popup_onglet_batch = Popups.onglet_batch;
        ctrl.popup_onglet_batch_callback = function(feedback) { console.log(feedback); };

        ctrl.filters = {
          text: '',
          groups: [],
          grades: []
        };
        ctrl.only_display_contributed_to = false;
        ctrl.eleves = [];

        let fix_avatar_url = function(avatar_url) {
          return (_(avatar_url.match(/^(user|http)/)).isNull() ? `${URL_ENT}/` : '') + avatar_url;
        };

        ctrl.apply_filters = function() {
          var selected_groups_ids = _.chain(ctrl.groups).where({ selected: true }).pluck('id').value();
          var selected_grades_ids = _.chain(ctrl.grades).where({ selected: true }).pluck('id').value();

          return function(pupil) {
            return `${pupil.firstname}${pupil.lastname}`.toLocaleLowerCase().includes(ctrl.filters.text.toLocaleLowerCase())
              && (selected_groups_ids.length == 0 || _(selected_groups_ids).contains(pupil.regroupement.id))
              && (selected_grades_ids.length == 0 || _(selected_grades_ids).intersection(_(pupil.regroupement.grades).pluck('grade_id')).length > 0)
              && (!ctrl.only_display_contributed_to || pupil.contributed);
          };
        };

        ctrl.clear_filters = function(type) {
          _(ctrl[type]).each(function(item) { item.selected = false; });
        };

        ctrl.pluck_selected_uids = function() {
          var filter = ctrl.apply_filters();

          return _.chain(ctrl.eleves)
            .select(function(pupil) { return filter(pupil); })
            .pluck('id')
            .value();
        };

        ctrl.pluriel = function(item_count, character) {
          return item_count > 1 ? character : '';
        }

        APIs.get_current_user()
          .then(function(response) {
            ctrl.current_user = response;

            ctrl.current_user.avatar = fix_avatar_url(ctrl.current_user.avatar);
            ctrl.can_do_batch = false; // !_(['TUT', 'ELV']).contains(ctrl.current_user.profil_actif.type);


            return APIs.query_carnets_contributed_to(ctrl.current_user.id);
          },
          function error(response) { })
          .then(function success(response) {
            ctrl.contributed_to = _(response.data).pluck('uid_eleve');

            return APIs.get_current_user_groups();
          },
          function error(response) { })
          .then(function(groups) {
            let classes = _(groups).where({ type: 'CLS' });

            if (ctrl.current_user.profil_actif.type === 'ELV') {
              ctrl.current_user.regroupement = { libelle: classes[0].name };
              ctrl.current_user.contributed = true;

              ctrl.eleves = [ctrl.current_user];
            } else if (ctrl.current_user.profil_actif.type === 'TUT') {
              let users_ids = _(ctrl.current_user.children).pluck('child_id');

              if (!_(users_ids).isEmpty()) {
                APIs.get_users(users_ids)
                  .then(function(users) {
                    ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function(eleve) {
                      eleve.avatar = fix_avatar_url(eleve.avatar);
                      let groups_ids = _(eleve.groups).pluck('group_id');

                      if (!_(groups_ids).isEmpty()) {
                        APIs.get_groups(groups_ids)
                          .then(function(response) {
                            let regroupement = _(response.data).findWhere({ type: 'CLS' });

                            if (!_(regroupement).isUndefined()) {
                              eleve.regroupement = {
                                id: regroupement.id,
                                name: regroupement.name,
                                type: regroupement.type
                              };
                              eleve.etablissement = regroupement.structure_id;
                              eleve.enseignants = regroupement.profs;
                            }
                          });
                      }

                      return eleve;
                    }));
                  });
              }
            } else {
              APIs.get_groups(_.chain(classes)
                .select(function(regroupement) {
                  return _(regroupement).has('structure_id') && regroupement.structure_id === ctrl.current_user.profil_actif.structure_id;
                })
                .pluck('id')
                .uniq()
                .value())
                .then(function success(response) {
                  ctrl.groups = response.data;
                  ctrl.eleves = [];

                  APIs.get_grades(_.chain(response.data)
                    .pluck('grades')
                    .flatten()
                    .pluck('grade_id')
                    .value())
                    .then(function success(response) {
                      ctrl.grades = response.data;
                    },
                    function error(response) { });

                  _(response.data).each(function(regroupement) {
                    regroupement.profs = _.chain(regroupement.users).select(function(user) { return user.type === 'ENS'; }).pluck('user_id').value();
                    let users_ids = _.chain(regroupement.users).select(function(user) { return user.type === 'ELV'; }).pluck('user_id').value();

                    APIs.get_users(users_ids)
                      .then(function(users) {
                        ctrl.eleves = ctrl.eleves.concat(_(users.data).map(function(eleve) {
                          eleve.avatar = fix_avatar_url(eleve.avatar);

                          eleve.contributed = _(ctrl.contributed_to).contains(eleve.id);
                          eleve.regroupement = regroupement;
                          eleve.etablissement = regroupement.structure_id;
                          eleve.enseignants = regroupement.profs;

                          return eleve;
                        }));
                      });
                  });
                },
                function error(response) { });
            }
          });
      }],
    template: `
<div class="col-md-4 vert-moins aside" style="padding: 0;">

  <div class="stats vert-plus" style="color: #efefef; text-align: right;">
    <button class="btn btn-sm pull-left"
            ng:if="$ctrl.contributed_to.length > 0"
            ng:class="{'btn-success': !$ctrl.only_display_contributed_to,
                      'btn-primary': $ctrl.only_display_contributed_to}"
            ng:model="$ctrl.only_display_contributed_to"
            uib:btn-checkbox>
      N'afficher que le{{$ctrl.pluriel($ctrl.contributed_to.length, 's')}} carnet{{$ctrl.pluriel($ctrl.contributed_to.length, 's')}} au{{$ctrl.pluriel($ctrl.contributed_to.length, 'x')}}quel{{$ctrl.pluriel($ctrl.contributed_to.length, 's')}} j'ai contribué.
    </button>
    <h3 style="margin: 0; padding: 5px 15px; width: 100%;">
      {{$ctrl.filtered.length}} élève{{$ctrl.pluriel($ctrl.filtered.length, 's')}} affiché{{$ctrl.pluriel($ctrl.filtered.length, 's')}} <span class="glyphicon glyphicon-hand-right">
      </span>
    </h3>

    <div class="batch-operations" ng:if="$ctrl.can_do_batch">
      <label>Actions groupées</label>
      <div class="btn-group">
        <button class="btn btn-success pull-right" ng:click="$ctrl.popup_onglet_batch( $ctrl.pluck_selected_uids(), $ctrl.popup_onglet_batch )">
          <span class="glyphicon glyphicon-folder-close"></span> Nouvel onglet
        </button>
      </div>
    </div>
  </div>

  <div class="search-filter" style="padding: 20px; background-color: #baddad;">
    <label for="search"> Filtrage des élèves affichés <button class="btn btn-xs"
                                                              ng:click="$ctrl.filters.text = ''">
        <span class="glyphicon glyphicon-remove">
        </span>
      </button> : </label>
    <input  class="form-control input-sm"
            style="display: inline; max-width: 300px;"
            type="text" name="search"
            ng:model="$ctrl.filters.text" />
  </div>

  <div class="group-filter" style="padding: 20px; background-color: #baddad;" ng:if="$ctrl.groups.length > 0">
    <label> Filtrage par classe <button class="btn btn-xs"
                                        ng:click="$ctrl.clear_filters('groups')">
        <span class="glyphicon glyphicon-remove">
        </span>
      </button> :
    </label>
    <div class="btn-group">
      <button class="btn btn-sm" style="margin: 2px;"
              ng:repeat="group in $ctrl.groups | orderBy:['name']"
              ng:class="{'btn-primary': group.selected, 'btn-success': !group.selected}"
              ng:model="group.selected"
              uib:btn-checkbox>
        {{group.name}}
      </button>
    </div>
  </div>

  <div class="group-filter" style="padding: 20px; background-color: #baddad;" ng:if="$ctrl.groups.length > 0">
    <label> Filtrage par niveau <button class="btn btn-xs"
                                        ng:click="$ctrl.clear_filters('grades')">
        <span class="glyphicon glyphicon-remove">
        </span>
      </button> : </label>
    <div class="btn-group">
      <button class="btn btn-sm" style="margin: 2px;"
              ng:repeat="grade in $ctrl.grades | orderBy:['name']"
              ng:class="{'btn-primary': grade.selected, 'btn-success': !grade.selected}"
              ng:model="grade.selected"
              uib:btn-checkbox>
        {{grade.name}}
      </button>
    </div>
  </div>
</div>

<div class="col-md-8 vert-moins damier trombinoscope">
  <ul>
    <li class="col-xs-6 col-sm-4 col-md-3 col-lg-2 petite case vert-moins"
        style="background-repeat: no-repeat; background-attachment: scroll; background-clip: border-box; background-origin: padding-box; background-position-x: center; background-position-y: center; background-size: 100% auto;"
        ng:class="{'contributed': eleve.contributed}"
        ng:style="{'background-image': 'url( {{eleve.avatar}} )' }"
        ng:repeat="eleve in $ctrl.filtered = ( $ctrl.eleves | filter:$ctrl.apply_filters() | orderBy:['regroupement.name', 'lastname'] )">
      <a class="eleve"
         ui:sref="carnet({uid_eleve: eleve.id})">
        <h5 class="regroupement">{{eleve.regroupement.name}}</h5>

        <div class="full-name" title="{{eleve.contributed ? 'Vous avez contributé à ce carnet' : ''}}">
          <h4 class="first-name">{{eleve.firstname}}</h4>
          <h3 class="last-name">{{eleve.lastname}}</h3>
        </div>
      </a>
    </li>
  </ul>
</div>
`
  });
