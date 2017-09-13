'use strict';
angular.module('suiviApp')
    .component('userDetails', { bindings: { uid: '<',
        small: '<',
        showAvatar: '<',
        showConcernedPeople: '<',
        showPhones: '<',
        showEmails: '<',
        showClasse: '<',
        showAddress: '<',
        showBirthdate: '<' },
    controller: ['APIs', 'URL_ENT',
        function (APIs, URL_ENT) {
            var ctrl = this;
            ctrl.URL_ENT = URL_ENT;
            ctrl.$onInit = function () {
                APIs.get_user(ctrl.uid)
                    .then(function success(response) {
                    ctrl.user = response.data;
                    if (ctrl.showClasse) {
                        ctrl.user.get_actual_groups()
                            .then(function (response) {
                            ctrl.user.actual_groups = response;
                            _(ctrl.user.actual_groups).each(function (group) {
                                APIs.get_structure(group.structure_id)
                                    .then(function (response) {
                                    group.structure = response.data;
                                });
                            });
                        });
                    }
                }, function error(response) { });
                if (ctrl.showConcernedPeople) {
                    APIs.query_people_concerned_about(ctrl.uid)
                        .then(function success(response) {
                        ctrl.concerned_people = _(response).groupBy('type');
                        delete ctrl.concerned_people['Élève'];
                    }, function error(response) { });
                }
            };
        }],
    template: "\n<div class=\"col-md-12\">\n    <img class=\"col-md-4 avatar noir-moins\"\n         ng:src=\"{{$ctrl.URL_ENT + '/' + $ctrl.user.avatar}}\"\n         ng:if=\"$ctrl.showAvatar\" />\n\n    <div class=\"col-md-8 details\">\n        <div class=\"col-md-12\">\n            <span class=\"first-name\"\n                  ng:style=\"{'font-size': $ctrl.small ? '100%' : '150%'}\"> {{$ctrl.user.firstname}}\n            </span>\n            <span class=\"last-name\"\n                  ng:style=\"{'font-size': $ctrl.small ? '100%' : '175%'}\"> {{$ctrl.user.lastname}}\n            </span>\n        </div>\n\n        <span class=\"col-md-12 classe\" ng:if=\"$ctrl.showClasse\">\n            <span ng:repeat=\"group in $ctrl.user.actual_groups | filter:{type: 'CLS'}\">\n                {{group.name}} - {{group.structure.name}}\n            </span>\n        </span>\n\n        <span class=\"col-md-12 birthdate\" ng:if=\"$ctrl.showBirthdate\">\n            n\u00E9<span ng:if=\"$ctrl.user.gender === 'F'\">e</span> le {{$ctrl.user.birthdate | date}}\n        </span>\n        <div class=\"col-md-12 email\"\n             ng:repeat=\"email in $ctrl.user.emails\"\n             ng:if=\"$ctrl.showEmails\">\n            <span class=\"glyphicon glyphicon-envelope\"></span>\n            <a href=\"mailto:{{email.address}}\">{{email.address}}</a>\n        </div>\n        <span class=\"col-md-12 address\"\n              ng:if=\"$ctrl.showAddress && $ctrl.user.adresse\">\n            <span class=\"glyphicon glyphicon-home\"></span>\n            <span style=\"display: inline-table;\">\n                {{$ctrl.user.address}}\n                <br>\n                {{$ctrl.user.zipcode}} {{$ctrl.user.city}}\n            </span>\n        </span>\n        <div class=\"col-md-12 phone\"\n             ng:repeat=\"phone in $ctrl.user.phones\"\n             ng:if=\"$ctrl.showPhones\">\n            <span class=\"glyphicon\"\n                  ng:class=\"{'glyphicon-phone': phone.type === 'PORTABLE', 'glyphicon-phone-alt': phone.type !== 'PORTABLE'}\">\n                {{phone.type}}: {{phone.number}}\n            </span>\n        </div>\n    </div>\n</div>\n\n<fieldset class=\"pull-left col-md-12 parents\" ng:if=\"$ctrl.showConcernedPeople\">\n    <legend>Personnes concern\u00E9es</legend>\n    <uib-accordion>\n        <div uib-accordion-group\n             class=\"panel-default\"\n             ng:repeat=\"(type, peoples) in $ctrl.concerned_people\"\n             ng:if=\"type != 'Autre \u00E9l\u00E8ve suivi'\">\n            <uib-accordion-heading>\n                <span class=\"glyphicon\" ng:class=\"{'glyphicon-menu-down': type.is_open, 'glyphicon-menu-right': !type.is_open}\"></span> {{type}}\n            </uib-accordion-heading>\n            <ul>\n                <li ng:repeat=\"people in peoples | orderBy:'lastname'\">\n                    <span ng:if=\"!people.contributed_to\">{{people.firstname}} {{people.lastname}}</span>\n                    <span ng:if=\"people.contributed_to\"><a ui:sref=\"carnet({uid_eleve: people.id})\">{{people.firstname}} {{people.lastname}}</a></span>\n                    <span ng:if=\"people.prof_principal\"> (enseignant principal)</span>\n                    <span ng:if=\"people.actual_subjects\">\n                        <br/>\n                        <em ng:repeat=\"subject in people.actual_subjects\">\n                            <span class=\"glyphicon glyphicon-briefcase\"></span> {{subject.name}}\n                        </em>\n                    </span>\n                    <span ng:if=\"people.emails.length > 0\">\n                        <br/>\n                        <span class=\"glyphicon glyphicon-envelope\"></span> <a href=\"mailto:{{people.emails[0].address}}\">{{people.emails[0].address}}</a>\n                    </span>\n                </li>\n            </ul>\n        </div>\n    </uib-accordion>\n</fieldset>\n"
});
