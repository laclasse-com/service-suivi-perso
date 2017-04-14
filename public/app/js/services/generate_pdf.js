'use strict';

angular.module( 'suiviApp' )
    .service( 'GeneratePDF',
              [ 'APIs', 'Saisies',
                function( APIs, Saisies ) {
                    var service = this;
                    var pdfMake = pdfMake;

                    service.onglet = function( uid, onglet ) {
                        var eleve = null;
                        var saisies = [];

                        var docDefinition = { content: [],
                                              styles: { eleve: { fontSize: 18,
                                                                 bold: true },
                                                        nom: {  },
                                                        'classe-etablissement': { fontSize: 10 },
                                                        saisie: { fontSize: 14 },
                                                        contenu: {  }
                                                      }
                                            };

                        // TODO: embed fonts

                        APIs.get_user( uid )
                            .then( function success( response ) {
                                eleve = response.data;

                                docDefinition.content.push( { text: eleve.prenom + ' ' + eleve.nom,
                                                              style: [ 'eleve', 'nom' ] } );
                                docDefinition.content.push( { text: eleve.classes[0].classe_libelle + ' - ' + eleve.classes[0].etablissement_nom,
                                                              style: [ 'eleve', 'classe-etablissement' ] } );

                                return Saisies.query({ uid_eleve: uid,
                                                       onglet_id: onglet.id }).$promise;
                            } ,
                                   function error( response ) {} )
                            .then( function success( response ) {
                                _(response).each( function( saisie, index ) {
                                    docDefinition.content.push( { text: saisie.contenu,
                                                                  style: [ 'saisie', 'contenu' ] } );
                                } );

                                pdfMake.createPdf(docDefinition).download();
                            },
                                   function error( response ) {} );
                    };
                } ] );
