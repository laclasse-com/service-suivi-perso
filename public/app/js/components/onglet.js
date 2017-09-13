'use strict';
angular.module('suiviApp')
    .component('onglet', { bindings: { uidEleve: '<',
        onglets: '<',
        onglet: '=' },
    controller: ['$uibModal', '$state', '$q', 'Saisies', 'Popups',
        function ($uibModal, $state, $q, Saisies, Popups) {
            var ctrl = this;
            ctrl.manage_onglet = Popups.onglet;
            ctrl.order_by = { field: 'date',
                reverse: true };
            ctrl.callback_popup_onglet = function (onglet) {
                if (onglet.action == 'deleted') {
                    $state.go('carnet', { uid_eleve: ctrl.uidEleve }, { reload: true });
                }
            };
            ctrl.saisie_callback = function (saisie) {
                switch (saisie.action) {
                    case 'created':
                        ctrl.saisies.push(saisie);
                        init_new_saisie();
                        break;
                    case 'deleted':
                        ctrl.saisies = _(ctrl.saisies).reject(function (s) { return s.id === saisie.id; });
                        break;
                    case 'updated':
                        break;
                    default:
                        console.log('What to do with this?');
                        console.log(saisie);
                }
            };
            // var print = function() {
            //     var printDump = document.getElementById('printDump');
            //     var pdf = new jsPDF( 'l', 'pt', 'a4' );
            //     return $q.all( _(angular.element('.active saisie'))
            //                    .map( function( elt ) {
            //                        return html2canvas( elt );
            //                    } ) )
            //         .then( function( canvases ) {
            //             var y = 0;
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
            var init_new_saisie = function () {
                ctrl.new_saisie = ctrl.onglet.writable ? { create_me: true } : null;
            };
            ctrl.$onInit = function () {
                init_new_saisie();
                Saisies.query({ uid_eleve: ctrl.uidEleve,
                    onglet_id: ctrl.onglet.id }).$promise
                    .then(function success(response) {
                    ctrl.saisies = response;
                }, function error(response) { });
            };
        }],
    template: "\n<div class=\"col-md-3 pull-right\"\n     style=\"text-align: right;\">\n    <button class=\"btn btn-lg btn-warning\"\n            style=\"width: 100%;\"\n            ng:if=\"$ctrl.onglet.manageable\"\n            ng:click=\"$ctrl.manage_onglet( $ctrl.uidEleve, $ctrl.onglet, $ctrl.onglets, $ctrl.callback_popup_onglet )\">\n        <span class=\"glyphicon glyphicon-cog\"></span> Configuration de l'onglet\n    </button>\n<!--\n    <button class=\"btn btn-lg btn-primary\"\n            style=\"width: 100%;\"\n            ng:click=\"$ctrl.print()\">\n        <span class=\"glyphicon glyphicon-print\"></span> Exporter en PDF\n    </button>\n-->\n</div>\n\n<saisie class=\"col-md-9\"\n        style=\"display: inline-block;\"\n        ng:if=\"$ctrl.new_saisie\"\n        uid-eleve=\"$ctrl.uidEleve\"\n        onglet=\"$ctrl.onglet\"\n        saisie=\"$ctrl.new_saisie\"\n        callback=\"$ctrl.saisie_callback( $ctrl.new_saisie )\"></saisie>\n\n<div class=\"col-md-9\" style=\"margin-bottom: 10px;\">\n    <button class=\"btn btn-sm btn-primary pull-right\"\n            ng:click=\"$ctrl.order_by.reverse = !$ctrl.order_by.reverse\"\n            ng:if=\"$ctrl.saisies.length > 1\">\n        <span class=\"glyphicon\"\n              ng:class=\"{'glyphicon-sort-by-order': $ctrl.order_by.reverse, 'glyphicon-sort-by-order-alt': !$ctrl.order_by.reverse}\"></span>\nTrier par la date de publication la plus <span ng:if=\"$ctrl.order_by.reverse\">r\u00E9cente</span><span ng:if=\"!$ctrl.order_by.reverse\">ancienne</span>.\n    </button>\n</div>\n\n<saisie class=\"col-md-9\"\n        style=\"display: inline-block;\"\n        ng:repeat=\"saisie in $ctrl.saisies | orderBy:$ctrl.order_by.field:$ctrl.order_by.reverse\"\n        uid-eleve=\"$ctrl.uidEleve\"\n        onglet=\"$ctrl.onglet\"\n        saisie=\"saisie\"\n        callback=\"$ctrl.saisie_callback( saisie )\"></saisie>\n"
});
