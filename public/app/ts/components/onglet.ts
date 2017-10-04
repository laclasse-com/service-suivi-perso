'use strict';

angular.module('suiviApp')
  .component('onglet',
  {
    bindings: {
      uidEleve: '<',
      onglets: '<',
      onglet: '='
    },
    controller: ['$uibModal', '$state', '$q', 'Saisies', 'Popups',
      function($uibModal, $state, $q, Saisies, Popups) {
        let ctrl = this;

        ctrl.manage_onglet = Popups.onglet;

        ctrl.order_by = {
          field: 'date',
          reverse: true
        };

        ctrl.callback_popup_onglet = function(onglet) {
          if (onglet.action == 'deleted') {
            $state.go('carnet',
              { uid_eleve: ctrl.uidEleve },
              { reload: true });
          }
        };

        ctrl.saisie_callback = function(saisie) {
          switch (saisie.action) {
            case 'created':
              ctrl.saisies.push(saisie);
              init_new_saisie();
              break;
            case 'deleted':
              ctrl.saisies = _(ctrl.saisies).reject(function(s) { return s.id === saisie.id; });
              break;
            case 'updated':
              break;
            default:
              console.log('What to do with this?')
              console.log(saisie)
          }

        };

        // let print = function() {
        //     let printDump = document.getElementById('printDump');
        //     let pdf = new jsPDF( 'l', 'pt', 'a4' );
        //     return $q.all( _(angular.element('.active saisie'))
        //                    .map( function( elt ) {
        //                        return html2canvas( elt );
        //                    } ) )
        //         .then( function( canvases ) {
        //             let y = 0;

        //             _(canvases).each( function( canvasObj ) {
        //                 printDump.appendChild( canvasObj ); //appendChild is required for html to add page in pdf

        //                 pdf.addHTML( canvasObj, 0, y, { pagesplit: true,
        //                                                 background: '#fff' } )
        //                     .then( function() {
        //                         printDump.removeChild( canvasObj );
        //                     } );
        //                 y += canvasObj.height;
        //             } );

        //             // pdf.addPage();
        //             pdf.save( ctrl.onglet.name + '.pdf' );
        //             return $q.resolve( 'terminé' );
        //         } );
        // };
        // ctrl.print = function() {
        //     swal( { title: "Export au format PDF...",
        //             text: "traitement en cours",
        //             type: "info",
        //             showLoaderOnConfirm: true,
        //             onOpen: function(){
        //                 swal.clickConfirm();
        //             },
        //             preConfirm: function() {
        //                 return new Promise( function( resolve ) {
        //                     print().then(
        //                         function success( response ) {
        //                             swal.closeModal();
        //                         } );
        //                 } );
        //             },
        //             allowOutsideClick: false } );
        // };

        let init_new_saisie = function() {
          ctrl.new_saisie = ctrl.onglet.writable ? { create_me: true } : null;
        };

        ctrl.$onInit = function() {
          init_new_saisie();

          Saisies.query({
            onglet_id: ctrl.onglet.id
          }).$promise
            .then(function success(response) {
              ctrl.saisies = response;
            },
            function error(response) { });
        };
      }],
    template: `
<span class="hidden-xs hidden-sm floating-button toggle big off jaune"
ng:if="$ctrl.onglet.manageable"
ng:click="$ctrl.manage_onglet( $ctrl.uidEleve, $ctrl.onglet, $ctrl.onglets, $ctrl.callback_popup_onglet )"></span>

<saisie class="col-md-12"
style="display: inline-block;"
ng:if="$ctrl.new_saisie"
onglet="$ctrl.onglet"
saisie="$ctrl.new_saisie"
callback="$ctrl.saisie_callback( $ctrl.new_saisie )"></saisie>

<div class="col-md-12" style="margin-bottom: 10px;">
<button class="btn btn-sm btn-primary pull-right"
ng:click="$ctrl.order_by.reverse = !$ctrl.order_by.reverse"
ng:if="$ctrl.saisies.length > 1">
<span class="glyphicon"
ng:class="{'glyphicon-sort-by-order': $ctrl.order_by.reverse, 'glyphicon-sort-by-order-alt': !$ctrl.order_by.reverse}"></span>
Trier par la date de publication la plus <span ng:if="$ctrl.order_by.reverse">récente</span><span ng:if="!$ctrl.order_by.reverse">ancienne</span>.
</button>
</div>

<div class="col-md-12 saisies" style="overflow-y: auto;">

<saisie class="col-md-12" style="display: inline-block;"
ng:repeat="saisie in $ctrl.saisies | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse"
onglet="$ctrl.onglet"
saisie="saisie"
callback="$ctrl.saisie_callback( saisie )"></saisie>
</div>
`
  });
