'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'suiviApp',
                [ 'ngColorPicker',
                  'ngResource',
                  'textAngular',
                  'ui.bootstrap',
                  'ui.router' ] )
    .config( [ '$httpProvider',
               function( $httpProvider ) {
                   $httpProvider.defaults.withCredentials = true;
               }] )
// textAngular
    .config( [ '$provide',
               function( $provide ) {
                   //traduction de textAngular
                   $provide.decorator( 'taTranslations',
                                       function( $delegate ) {
                                           $delegate.html.tooltip = 'Basculer entre les vues HTML et texte enrichi';
                                           $delegate.justifyLeft.tooltip = 'Justifier à gauche';
                                           $delegate.justifyCenter.tooltip = 'Centrer';
                                           $delegate.justifyRight.tooltip = 'Justifier à droite';
                                           $delegate.bold.tooltip = 'Mettre en gras';
                                           $delegate.italic.tooltip = 'Mettre en italique';
                                           $delegate.underline.tooltip = 'Souligner';
                                           $delegate.insertLink.tooltip = 'Insérer un lien';
                                           $delegate.insertLink.dialogPrompt = 'Lien à insérer';
                                           $delegate.editLink.targetToggle.buttontext = 'Le lien s\'ouvrira dans une nouvelle fenêtre';
                                           $delegate.editLink.reLinkButton.tooltip = 'Éditer le lien';
                                           $delegate.editLink.unLinkButton.tooltip = 'Enlever le lien';
                                           $delegate.insertImage.tooltip = 'Insérer une image';
                                           $delegate.insertImage.dialogPrompt = 'URL de l\'image :';
                                           $delegate.insertVideo.tooltip = 'Insérer une vidéo';
                                           $delegate.insertVideo.dialogPrompt = 'URL de la vidéo Youtube :';
                                           $delegate.clear.tooltip = 'Enlever le formattage';
                                           $delegate.ul.tooltip = 'Liste';
                                           $delegate.ol.tooltip = 'Liste numérotée';
                                           $delegate.quote.tooltip = 'Citation';
                                           $delegate.undo.tooltip = 'Annuler';
                                           $delegate.redo.tooltip = 'Rétablir';

                                           return $delegate;
                                       } );

                   // configuration de textAngular
                   $provide.decorator( 'taOptions',
                                       [ '$delegate', 'taRegisterTool',
                                         function( taOptions, taRegisterTool ){
                                             var colorpicker_taTool = function( type ) {
                                                 var style_prefix = ( type === 'backcolor' ) ? 'background-' : '';
                                                 var couleurs = [ '#7bd148', '#5484ed', '#a4bdfc', '#46d6db', '#7ae7bf', '#51b749', '#fbd75b', '#ffb878', '#ff887c', '#dc2127', '#dbadff', '#e1e1e1' ];
                                                 if ( type === 'backcolor' ) {
                                                     couleurs.push( 'transparent' );
                                                 }

                                                 return { couleurs: couleurs,
                                                          display: '<span uib-dropdown><a uib-dropdown-toggle><i class="fa fa-font" data-ng-style="{\'' + style_prefix + 'color\': selected }"></i> <i class="fa fa-caret-down"></i></a><ng-color-picker uib-dropdown-menu selected="selected" colors="couleurs"></ng-color-picker></span>',
                                                          action: function( ) {
                                                              return ( this.selected === 'nil' ) ? false : this.$editor().wrapSelection( type, this.selected );
                                                          }
                                                        };
                                             };

                                             taRegisterTool( 'fontColor', colorpicker_taTool( 'forecolor' ) );

                                             taOptions.toolbar = [ [ 'bold', 'italics', 'underline', 'ul', 'ol', 'quote', 'fontColor', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertLink', 'insertImage', 'insertVideo', 'html', 'undo', 'redo' ] ];

                                             taOptions.classes = {
                                                 focussed: 'focussed',
                                                 toolbar: 'btn-toolbar',
                                                 toolbarGroup: 'btn-group',
                                                 toolbarButton: 'btn btn-default',
                                                 toolbarButtonActive: 'active',
                                                 disabled: 'disabled',
                                                 textEditor: 'form-control',
                                                 htmlEditor: 'form-control'
                                             };
                                             return taOptions;
                                         } ] );

                   $provide.decorator( 'taTools',
                                       [ '$delegate',
                                         function( taTools ){
                                             taTools.html.buttontext = 'HTML';

                                             return taTools;
                                         } ] );
               } ] );
