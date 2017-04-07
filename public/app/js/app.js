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
                   // configuration de textAngular
                   $provide.decorator( 'taOptions',
                                       [ '$delegate', 'taRegisterTool',
                                         function( taOptions, taRegisterTool ){
                                             taOptions.toolbar = [
                                                 [ 'bold', 'italics', 'underline', 'ul', 'ol', 'quote', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertLink', 'html', 'redo', 'undo' ]
                                             ];

                                             var colorpicker_taTool = function( type ) {
                                                 var style = ( type === 'backcolor' ) ? 'background-' : '';
                                                 var couleurs = [ '#7bd148', '#5484ed', '#a4bdfc', '#46d6db', '#7ae7bf', '#51b749', '#fbd75b', '#ffb878', '#ff887c', '#dc2127', '#dbadff', '#e1e1e1' ];
                                                 if ( type === 'backcolor' ) {
                                                     couleurs.push( 'transparent' );
                                                 }

                                                 return { couleurs: couleurs,
                                                          display: '<span uib-dropdown><a uib-dropdown-toggle><i class="fa fa-font" data-ng-style="{\'' + style + 'color\': selected }"></i> <i class="fa fa-caret-down"></i></a><ng-color-picker uib-dropdown-menu selected="selected" colors="couleurs"></ng-color-picker></span>',
                                                          action: function( ) {
                                                              return ( this.selected === 'nil' ) ? false : this.$editor().wrapSelection( type, this.selected );
                                                          }
                                                        };
                                             };

                                             taRegisterTool( 'fontColor', colorpicker_taTool( 'forecolor' ) );
                                             taOptions.toolbar[0].push( 'fontColor' );

                                             taRegisterTool( 'backgroundColor', colorpicker_taTool( 'backcolor' ) );
                                             taOptions.toolbar[0].push( 'backgroundColor' );

                                             taRegisterTool( 'table', { columns: { value: 1,
                                                                                   hovered: 1 },
                                                                        rows: { value: 1,
                                                                                hovered: 1 },
                                                                        hover: function( objet, value ) {
                                                                            objet.hovered = value;
                                                                        },
                                                                        leave: function( objet ) {
                                                                            objet.hovered = objet.value;
                                                                        },
                                                                        tooltiptext: 'insérer un tableau',
                                                                        display: '<span uib-dropdown><a uib-dropdown-toggle><i class="fa fa-table"></i> <i class="fa fa-caret-down"></i></a><div uib-dropdown-menu data-ng-click="$event.stopPropagation()"><label><rating on-hover="hover( columns, value )" on-leave="leave( columns )" ng-model="columns.value" max="15" state-on="\'glyphicon-stop\'" state-off="\'glyphicon-unchecked\'"></rating><br>{{columns.hovered}} colonnes</label><br><label><rating on-hover="hover( rows, value )" on-leave="leave( rows )" ng-model="rows.value" max="15" state-on="\'glyphicon-stop\'" state-off="\'glyphicon-unchecked\'"></rating><br>{{rows.hovered}} lignes</label><br><button class="btn btn-success" data-ng-click="insert_table()">Insérer</button></div></span>',
                                                                        insert_table: function(  ) {
                                                                            var tds = '';
                                                                            for ( var idxCol = 0; idxCol < this.columns.value; idxCol++ ) {
                                                                                tds = tds + '<td>&nbsp;</td>';
                                                                            }
                                                                            var trs = '';
                                                                            for ( var idxRow = 0; idxRow < this.rows.value; idxRow++ ) {
                                                                                trs = trs + '<tr>'+ tds + '</tr>';
                                                                            }

                                                                            this.$editor().wrapSelection( 'insertHTML', '<table class="table table-bordered">' + trs + '</table>' );

                                                                            this.deferration.resolve();
                                                                        },
                                                                        action: function( deferred  ) {
                                                                            this.deferration = deferred;
                                                                            return false;
                                                                        } } );
                                             taOptions.toolbar[0].push( 'table' );

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
