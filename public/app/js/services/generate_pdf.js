'use strict';

angular.module( 'suiviApp' )
    .service( 'GeneratePDF',
              [ 'APIs', 'Saisies',
                function( APIs, Saisies ) {
                    var service = this;

                    service.onglet = function( uid, onglet ) {
                        var pdf = new jsPDF( 'p', 'mm', 'a4' );
                        var eleve = null;
                        var saisies = [];

                        // TODO: embed fonts

                        APIs.get_user( uid )
                            .then( function success( response ) {
                                eleve = response.data;

                                pdf.text( eleve.nom, 10, 10 )
                                    .setFontSize( 12 )
                                    .text( eleve.prenom, 10, 20 )
                                    .text( eleve.classes[0].classe_libelle + ' - ' + eleve.classes[0].etablissement_nom, 10, 30 );

                                return Saisies.query({ uid_eleve: uid,
                                                       onglet_id: onglet.id }).$promise;
                            } ,
                                   function error( response ) {} )
                            .then( function success( response ) {
                                saisies = response;

                                pdf.save( onglet.nom + '.pdf');
                            },
                                   function error( response ) {} );
                    };
                } ] );
