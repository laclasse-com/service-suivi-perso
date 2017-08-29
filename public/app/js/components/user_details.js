'use strict';

angular.module( 'suiviApp' )
    .component( 'userDetails',
                { bindings: { uid: '<',
                              small: '<',
                              showAvatar: '<',
                              showConcernedPeople: '<',
                              showPhones: '<',
                              showEmails: '<',
                              showClasse: '<',
                              showAddress: '<',
                              showBirthdate: '<' },
                  controller: [ 'APIs', 'URL_ENT',
                                function( APIs, URL_ENT ) {
                                    var ctrl = this;

                                    ctrl.URL_ENT  = URL_ENT;

                                    ctrl.$onInit = function() {
                                        APIs.get_user( ctrl.uid )
                                            .then( function success( response ) {
                                                ctrl.user = response.data;

                                                if ( ctrl.showClasse ) {
                                                    ctrl.user.get_actual_groups()
                                                        .then( function( response ) {
                                                            ctrl.user.actual_groups = response;

                                                            _(ctrl.user.actual_groups).each( function( group ) {
                                                                APIs.get_structure( group.structure_id )
                                                                    .then( function( response ) {
                                                                        group.structure = response.data;
                                                                    } );
                                                            } );
                                                        } );
                                                }
                                            },
                                                   function error( response ) {} );

                                        if ( ctrl.showConcernedPeople ) {
                                            APIs.query_people_concerned_about( ctrl.uid )
                                                .then( function success( response ) {
                                                    ctrl.concerned_people = _(response).groupBy('type');
                                                    delete ctrl.concerned_people['Élève'];
                                            },
                                                   function error( response ) {} );
                                        }
                                    };
                                } ],
                  template: `
<div class="col-md-12">
    <img class="col-md-4 avatar noir-moins"
         ng:src="{{$ctrl.URL_ENT + '/' + $ctrl.user.avatar}}"
         ng:if="$ctrl.showAvatar" />

    <div class="col-md-8 details">
        <div class="col-md-12">
            <span class="first-name"
                  ng:style="{'font-size': $ctrl.small ? '100%' : '150%'}"> {{$ctrl.user.firstname}}
            </span>
            <span class="last-name"
                  ng:style="{'font-size': $ctrl.small ? '100%' : '175%'}"> {{$ctrl.user.lastname}}
            </span>
        </div>

        <span class="col-md-12 classe" ng:if="$ctrl.showClasse">
            <span ng:repeat="group in $ctrl.user.actual_groups | filter:{type: 'CLS'}">
                {{group.name}} - {{group.structure.name}}
            </span>
        </span>

        <span class="col-md-12 birthdate" ng:if="$ctrl.showBirthdate">
            né<span ng:if="$ctrl.user.gender === 'F'">e</span> le {{$ctrl.user.birthdate | date}}
        </span>
        <div class="col-md-12 email"
             ng:repeat="email in $ctrl.user.emails"
             ng:if="$ctrl.showEmails">
            <span class="glyphicon glyphicon-envelope"></span>
            <a href="mailto:{{email.address}}">{{email.address}}</a>
        </div>
        <span class="col-md-12 address"
              ng:if="$ctrl.showAddress && $ctrl.user.adresse">
            <span class="glyphicon glyphicon-home"></span>
            <span style="display: inline-table;">
                {{$ctrl.user.address}}
                <br>
                {{$ctrl.user.zipcode}} {{$ctrl.user.city}}
            </span>
        </span>
        <div class="col-md-12 phone"
             ng:repeat="phone in $ctrl.user.phones"
             ng:if="$ctrl.showPhones">
            <span class="glyphicon"
                  ng:class="{'glyphicon-phone': phone.type === 'PORTABLE', 'glyphicon-phone-alt': phone.type !== 'PORTABLE'}">
                {{phone.type}}: {{phone.number}}
            </span>
        </div>
    </div>
</div>

<fieldset class="pull-left col-md-12 parents" ng:if="$ctrl.showConcernedPeople">
    <legend>Personnes concernées</legend>
    <uib-accordion>
        <div uib-accordion-group
             class="panel-default"
             ng:repeat="(type, peoples) in $ctrl.concerned_people">
            <uib-accordion-heading>
                <span class="glyphicon" ng:class="{'glyphicon-menu-down': type.is_open, 'glyphicon-menu-right': !type.is_open}"></span> {{type}}
            </uib-accordion-heading>
            <ul>
                <li ng:repeat="people in peoples | orderBy:'lastname'">
                    <span ng:if="!people.contributed_to">{{people.firstname}} {{people.lastname}}</span>
                    <span ng:if="people.contributed_to"><a ui:sref="carnet({uid_eleve: people.id})">{{people.firstname}} {{people.lastname}}</a></span>
                    <span ng:if="people.prof_principal"> (enseignant principal)</span>
                    <span ng:if="people.actual_subjects">
                        <br/>
                        <em ng:repeat="subject in people.actual_subjects">
                            <span class="glyphicon glyphicon-briefcase"></span> {{subject.name}}
                        </em>
                    </span>
                    <span ng:if="people.emails.length > 0">
                        <br/>
                        <span class="glyphicon glyphicon-envelope"></span> <a href="mailto:{{people.emails[0].address}}">{{people.emails[0].address}}</a>
                    </span>
                </li>
            </ul>
        </div>
    </uib-accordion>
</fieldset>
`
                } );
