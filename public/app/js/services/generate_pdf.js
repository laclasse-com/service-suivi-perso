'use strict';

angular.module( 'suiviApp' )
    .service( 'GeneratePDF',
              [ '$filter', 'APIs', 'Saisies',
                function( $filter, APIs, Saisies ) {
                    var service = this;

                    var substitute_in_string = function( string, substitutions ) {
                        return substitutions.reduce( function( acc_string, substitution ) {
                            return acc_string.replace( substitution.before, substitution.after );
                        }, string );
                    };

                    var sanitize_filename = function( filename ) {
                        return substitute_in_string( filename, [ { before: /[\/\?<>\\:\*\|":]/g, after: '' },
                                                                 { before: /[\x00-\x1f\x80-\x9f]/g, after: '' },
                                                                 { before: /^\.+$/, after: '' },
                                                                 { before: /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, after: '' },
                                                                 { before: /[\. ]+$/, after: '' } ] );
                    };

                    var html2pdfmake = function( html ) {
                        // FIXME: should use html2json or html2pdfmake instead
                        // console.log( html2json( html ) )
                        return substitute_in_string( html, [ { before: '<br/>', after: '\n' },
                                                             { before: '<p>',   after: '' },
                                                             { before: '</p>',  after: '\n\n' } ] );
                    };

                    service.onglet = function( uid, onglet ) {
                        var eleve = null;

                        var docDefinition = { content: [],
                                              styles: { eleve: { fontSize: 18,
                                                                 bold: true,
                                                                 alignment: 'left' },
                                                        nom: {  },
                                                        'classe-etablissement': { fontSize: 10 },
                                                        'nom-onglet': { alignment: 'right' },
                                                        saisie: { fontSize: 14 },
                                                        author: { italics: true,
                                                                  alignment: 'ĺeft' },
                                                        date: { fontSize: 10,
                                                                alignment: 'right' },
                                                        contenu: {  }
                                                      }
                                            };

                        APIs.get_user( uid )
                            .then( function success( response ) {
                                eleve = response.data;

                                docDefinition.content.push( { text: eleve.prenom + ' ' + eleve.nom,
                                                              style: [ 'eleve', 'nom' ] } );
                                docDefinition.content.push( { text: eleve.classes[0].classe_libelle + ' - ' + eleve.classes[0].etablissement_nom,
                                                              style: [ 'eleve', 'classe-etablissement' ] } );

                                docDefinition.content.push( { text: onglet.nom,
                                                              style: [ 'nom-onglet' ] } );

                                return Saisies.query({ uid_eleve: uid,
                                                       onglet_id: onglet.id }).$promise;
                            } ,
                                   function error( response ) {} )
                            .then( function success( response ) {
                                _(response).each( function( saisie ) {
                                    docDefinition.content.push( { text: '\n\n' } );
                                    docDefinition.content.push( { text: [ { text: saisie.uid_author,
                                                                            style: [ 'saisie', 'author' ] },
                                                                          { text: $filter( 'date' )( saisie.date_creation, 'medium' ),
                                                                            style: [ 'saisie', 'date' ] } ]
                                                                } );

                                    docDefinition.content.push( { text: html2pdfmake( saisie.contenu ),
                                                                  style: [ 'saisie', 'contenu' ] } );
                                } );

                                pdfMake.createPdf(docDefinition).download( sanitize_filename( eleve.prenom + '_' + eleve.nom + '-' + eleve.classes[0].classe_libelle + '-' + eleve.classes[0].etablissement_nom + '-' + onglet.nom + '.pdf' ) );
                            },
                                   function error( response ) {} );
                    };
                } ] );
