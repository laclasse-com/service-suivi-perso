angular.module('suiviApp')
  .component('carnet',
  {
    bindings: {
      uids: '<'
    },
               template: `
               <div class="col-md-4 gris1-moins aside aside-carnet">
                 <a class="col-md-12 btn btn-lg noir-moins go-back" ui:sref="trombinoscope()"> ↰ Retour au trombinoscope </a>

                 <user-details class="user-details eleve"
                               uid="$ctrl.uids[0]"
                               show-avatar="true"
                               show-emails="true"
                               show-classe="true"
                               show-birthdate="true"
                               show-address="true"
                               show-concerned-people="true"
                               ng:if="$ctrl.uids.length == 1"></user-details>

                 <ul ng:if="$ctrl.uids.length > 1">
                   <li style="list-style-type: none;"
                       ng:repeat="uid in $ctrl.uids">
                     <a class="eleve"
                        ui:sref="carnet({uids: [uid]})">
                       <user-details class="user-details eleve"
                                     uid="uid"
                                     small="true"
                                     show-avatar="true"
                                     show-classe="true"></user-details>
                     </a>
                   </li>
                 </ul>
               </div>

               <onglets class="col-md-8 carnet"
                        uid-eleve="$ctrl.uids[0]"
                        ng:if="$ctrl.uids.length == 1"></onglets>

               <onglets class="col-md-8 carnet"
                        uids-eleves="$ctrl.uids"
                        ng:if="$ctrl.uids.length > 1"></onglets>
`
  });
