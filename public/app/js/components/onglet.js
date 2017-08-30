'use strict';

angular.module( 'suiviApp' )
    .component( 'onglet',
                { bindings: { uidEleve: '<',
                              onglet: '=' },
                  controller: [ '$uibModal', '$state', '$q', 'Onglets', 'Saisies', 'Popups',
                                function( $uibModal, $state, $q, Onglets, Saisies, Popups ) {
                                    var ctrl = this;

                                    ctrl.manage_onglet = Popups.onglet;

                                    ctrl.callback_popup_onglet = function( onglet ) {
                                        if ( onglet.deleted ) {
                                            $state.go( 'carnet',
                                                       { uid_eleve: ctrl.uidEleve },
                                                       { reload: true } );
                                        }
                                    };

                                    ctrl.saisie_callback = function( saisie ) {
                                        switch( saisie.action ) {
                                        case 'created':
                                            ctrl.saisies.push( saisie );
                                            ctrl.saisies.shift();
                                            ctrl.saisies.unshift( { create_me: true, truc: 'bidule' } );
                                            break;
                                        case 'deleted':
                                            ctrl.saisies = _(ctrl.saisies).reject( function( s ) { return s.id === saisie.id; } );
                                            break;
                                        default:
                                            console.log('What to do with this?')
                                            console.log(saisie)
                                        }

                                    };

                                    var print = function() {
                                        var printDump = document.getElementById('printDump');
                                        var pdf = new jsPDF( 'l', 'pt', 'a4' );
                                        return $q.all( _(angular.element('.active saisie'))
                                                       .map( function( elt ) {
                                                    return html2canvas( elt );
                                                } ) )
                                            .then( function( canvases ) {
                                                var y = 0;

                                                _(canvases).each( function( canvasObj ) {
                                                    printDump.appendChild( canvasObj ); //appendChild is required for html to add page in pdf

                                                    pdf.addHTML( canvasObj, 0, y, { pagesplit: true,
                                                                                    background: '#fff' } )
                                                        .then( function() {
                                                            printDump.removeChild( canvasObj );
                                                        } );
                                                    y += canvasObj.height;
                                                } );

                                                // pdf.addPage();
                                                pdf.save( ctrl.onglet.name + '.pdf' );
                                                return $q.resolve( 'terminé' );
                                            } );
                                    };
                                    ctrl.print = function() {
                                        swal( { title: "Export au format PDF...",
                                                text: "traitement en cours",
                                                type: "info",
                                                showLoaderOnConfirm: true,
                                                onOpen: function(){
                                                    swal.clickConfirm();
                                                },
                                                preConfirm: function() {
                                                    return new Promise( function( resolve ) {
                                                        print().then(
                                                            function success( response ) {
                                                                swal.closeModal();
                                                            } );
                                                    } );
                                                },
                                                allowOutsideClick: false } );
                                    };

                                    ctrl.$onInit = function() {
                                        Saisies.query({ uid_eleve: ctrl.uidEleve,
                                                        onglet_id: ctrl.onglet.id }).$promise
                                            .then( function success( response ) {
                                                ctrl.saisies = ctrl.onglet.writable ? [ { create_me: true } ] : [];

                                                ctrl.saisies = ctrl.saisies.concat( response );
                                            },
                                                   function error( response ) {} );
                                    };
                                } ],
                  template: `
<div class="col-md-3 pull-right"
     style="text-align: right;">
    <button class="btn btn-lg btn-warning"
            style="width: 100%;"
            ng:if="$ctrl.onglet.writable"
            ng:click="$ctrl.manage_onglet( $ctrl.uidEleve, $ctrl.onglet, $ctrl.callback_popup_onglet )">
        <span class="glyphicon glyphicon-cog"></span> Configuration de l'onglet
    </button>
    <button class="btn btn-lg btn-primary"
            style="width: 100%;"
            ng:click="$ctrl.print()">
        <span class="glyphicon glyphicon-print"></span> Exporter en PDF
    </button>
</div>

<div id="printDump"></div>

<saisie class="col-md-9"
        style="display: inline-block;"
        ng:repeat="saisie in $ctrl.saisies"
        uid-eleve="$ctrl.uidEleve"
        onglet="$ctrl.onglet"
        saisie="saisie"
        callback="$ctrl.saisie_callback( saisie )"></saisie>
`
                } );
