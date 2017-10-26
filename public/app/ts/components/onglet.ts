'use strict';

angular.module('suiviApp')
  .config(['$compileProvider',
    function($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|blob|data):/);
    }])
  .component('onglet',
  {
    bindings: {
      uidEleve: '<',
      onglets: '<',
      onglet: '='
    },
    controller: ['$uibModal', '$state', '$q', '$window', '$sce', '$location', 'Saisies', 'Popups',
      function($uibModal, $state, $q, $window, $sce, $location, Saisies, Popups) {
        let ctrl = this;


        //         let dataURItoBlob = function(dataURI) {
        //           // convert base64/URLEncoded data component to raw binary data held in a string
        //           var byteString = (dataURI.split(',')[0].indexOf('base64') >= 0) ? atob(dataURI.split(',')[1]) : _.unescape(dataURI.split(',')[1]);

        //           // separate out the mime component
        //           var mimeString = dataURI.split(',')[0]
        //             .split(':')[1]
        //             .split(';')[0];

        //           // write the bytes of the string to a typed array
        //           var ia = new Uint8Array(byteString.length);
        //           for (var i = 0; i < byteString.length; i++) {
        //             ia[i] = byteString.charCodeAt(i);
        //           }

        //           return new Blob([ia], { type: mimeString });
        //         };

        //         let startBlobDownload = function(dataBlob, suggestedFileName) {
        //           if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //             // for IE
        //             window.navigator.msSaveOrOpenBlob(dataBlob, suggestedFileName);
        //           } else {
        //             // for Non-IE (chrome, firefox etc.)
        //             var urlObject = URL.createObjectURL(dataBlob);

        //             var downloadLink = angular.element('<a>Download</a>');
        //             downloadLink.css('display', 'none');
        //             downloadLink.attr('href', urlObject);
        //             downloadLink.attr('download', suggestedFileName);
        //             angular.element(document.body).append(downloadLink);
        //             downloadLink[0].click();

        //             // cleanup
        //             downloadLink.remove();
        //             URL.revokeObjectURL(urlObject);
        //           }
        //         }

        //         ctrl.export = function() {
        //           let wrap_by_tag = function(tag, content) { return `<${tag}>${content}</${tag}>`; };

        //           let table_header = `
        // <thead>
        // <tr class="table-header">
        // <th>Auteur</th>
        // <th>Date</th>
        // <th>Épinglé</th>
        // <th>Message</th>
        // </tr>
        // </thead>
        // `;
        //           let tbody = wrap_by_tag('tbody', _(ctrl.saisies).map(function(saisie) {
        //             return wrap_by_tag('tr', `${wrap_by_tag('td', saisie.uid_author)} ${wrap_by_tag('td', saisie.date_modification)} ${wrap_by_tag('td', saisie.pinned)} ${wrap_by_tag('td', saisie.contenu)}`)
        //           }).join(''));
        //           let table = wrap_by_tag('table', `${table_header}${tbody}`);
        //           let base64 = function(s) { return btoa(s); };

        //           let worksheet_name = 'nom du worksheet';
        //           let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet_name}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${table}</table></body></html>`;

        //           startBlobDownload(dataURItoBlob(`data:application/vnd.ms-excel;base64,${base64(template)}`), 'export.xls')
        //         };

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
              let index = _(ctrl.saisies).findIndex(function(s) { return s.id == saisie.id; })
              ctrl.saisies[index] = saisie;
              break;
            default:
              console.log('What to do with this?')
              console.log(saisie)
          }
        };

        let init_new_saisie = function() {
          ctrl.new_saisie = ctrl.onglet.writable ? { create_me: true } : null;
        };

        let filter_on_pin = function(pinned) {
          return function() {
            return function(saisie) {
              return saisie.pinned == pinned;
            }
          }
        }
        ctrl.filter_pinned = filter_on_pin(true);
        ctrl.filter_unpinned = filter_on_pin(false);

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

<!-- <button class="btn btn-primary" ng:click="$ctrl.export()">export</button> -->

<saisie class="col-md-12" style="display: inline-block;"
                                                 ng:repeat="saisie in $ctrl.saisies | filter:$ctrl.filter_pinned() | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse"
                                                 onglet="$ctrl.onglet"
                                                 saisie="saisie"
                                                 callback="$ctrl.saisie_callback( saisie )"></saisie>

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
                                                   ng:repeat="saisie in $ctrl.saisies | filter:$ctrl.filter_unpinned() | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse"
                                                   onglet="$ctrl.onglet"
                                                   saisie="saisie"
                                                   callback="$ctrl.saisie_callback( saisie )"></saisie>
                                         </div>
`
  });
