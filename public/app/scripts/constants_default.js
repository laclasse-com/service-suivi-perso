'use strict';

angular.module('suiviApp')
.constant('AVATAR_M', '/app/bower_components/charte-graphique-laclasse-com/images/avatar_masculin.svg')
.constant('AVATAR_F', '/app/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg')
.constant('AVATAR_DEFAULT', '/api/default_avatar/avatar_neutre.svg')
.constant('UAI_EVIGNAL', "0692165D")
.constant('GRID_COLOR', ['jaune', 'rouge', 'bleu', 'violet', 'bleu', 'violet', 'vert', 'jaune', 'vert', 'jaune', 'rouge', 'bleu', 'rouge', 'bleu', 'violet', 'vert'])
.config(['$provide', function($provide){
	// this demonstrates how to register a new tool and add it to the default toolbar
	$provide.decorator( 'taOptions',
			    [ '$delegate', 'taRegisterTool',
			      function( taOptions, taRegisterTool ){
				  taOptions.toolbar = [
				      ['bold', 'italics', 'underline'], ['ul', 'ol'], ['quote'], ['justifyLeft', 'justifyCenter', 'justifyRight'], ['insertLink'], ['html'], ['redo', 'undo']
				  ];

				  // var colorpicker_taTool = function( type ) {
				  //     var style = ( type === 'backcolor' ) ? 'background-' : '';
				  //     var couleurs = [ '#7bd148',
						//        '#5484ed',
						//        '#a4bdfc',
						//        '#46d6db',
						//        '#7ae7bf',
						//        '#51b749',
						//        '#fbd75b',
						//        '#ffb878',
						//        '#ff887c',
						//        '#dc2127',
						//        '#dbadff',
						//        '#e1e1e1' ];
				  //     if ( type === 'backcolor' ) {
					 //  couleurs.push( 'transparent' );
				  //     }

				  //     return { couleurs: couleurs,
					 //       display: '<span class="dropdown"><a dropdown-toggle class="dropdown-toggle"><i class="fa fa-font" data-ng-style="{\'' + style + 'color\': selected }"></i> <i class="fa fa-caret-down"></i></a><ng-color-picker dropdown-menu class="dropdown-menu" selected="selected" colors="couleurs"></ng-color-picker></span>',
					 //       action: function( ) {
						//    return ( this.selected === 'nil' ) ? false : this.$editor().wrapSelection( type, this.selected );
					 //       }
					 //     };
				  // };

				  // taRegisterTool( 'fontColor', colorpicker_taTool( 'forecolor' ) );
				  // taOptions.toolbar[0].push( 'fontColor' );

				  // taRegisterTool( 'backgroundColor', colorpicker_taTool( 'backcolor' ) );
				  // taOptions.toolbar[0].push( 'backgroundColor' );

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
				  return taOptions; // whatever you return will be the taOptions
			      } ] );

	$provide.decorator( 'taTools',
			    [ '$delegate',
			      function( taTools ){
				  taTools.html.buttontext = 'HTML';

				  return taTools;
			      } ] );
    } ] );