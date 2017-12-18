angular.module('suiviApp')
  .component('carnet',
  {
    bindings: { uidEleve: '<' },
    template: `
<div class="col-md-4 gris1-moins aside aside-carnet">
    <a class="col-md-12 btn btn-lg noir-moins go-back" ui:sref="trombinoscope()"> ↰ Retour au trombinoscope </a>

    <user-details class="user-details eleve"
                  uid="$ctrl.uidEleve"
                  show-avatar="true"
                  show-emails="true"
                  show-classe="true"
                  show-birthdate="true"
                  show-address="true"
                  show-concerned-people="true"></user-details>
</div>

<onglets class="col-md-8 carnet"
         uid-eleve="$ctrl.uidEleve"></onglets>
`
  });
