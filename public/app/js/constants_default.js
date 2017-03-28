'use strict';

angular.module('suiviApp')
    .constant('AVATAR_M', '/app/vendor/laclasse-common-client/images/avatar_masculin.svg')
    .constant('AVATAR_F', '/app/vendor/laclasse-common-client/images/avatar_feminin.svg')
    .constant('AVATAR_DEFAULT', '/api/default_avatar/avatar_neutre.svg')
    .constant('UAI_EVIGNAL', "0692165D")
    .constant('GRID_COLOR', ['jaune', 'rouge', 'bleu', 'violet', 'bleu', 'violet', 'vert', 'jaune', 'vert', 'jaune', 'rouge', 'bleu', 'rouge', 'bleu', 'violet', 'vert'])
    .config( [ '$provide', 'APP_PATH',
               function( $provide, APP_PATH ) {
                   $provide.decorator( 'taOptions',
                                       [ 'taRegisterTool', '$modal', '$rootScope', '$delegate',
                                         function( taRegisterTool, $modal, $rootScope, taOptions ) {
                                             taOptions.toolbar = [
                                                 ['bold', 'italics', 'underline'], ['ul', 'ol'], ['quote'], ['justifyLeft', 'justifyCenter', 'justifyRight'], ['insertLink'], ['html'], ['redo', 'undo'], []
                                             ];

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
                                             // // $delegate is the taOptions we are decorating
                                             // // register the tool with textAngular
                                             // taRegisterTool('upload', {
                                             //     display: '<button type="button" class="btn btn-default ng-scope" name="upload" title="insérer un fichier de son cartable ou non" unselectable="on" ng-disabled="isDisabled()" tabindex="-1" ng-click="executeAction()" ng-class="displayActiveToolClass(active)"><i class="glyphicon glyphicon-briefcase"></i></button>',
                                             //     action: function(){
                                             //         if ($rootScope.docs.length > 0) {alert("vous ne pouvez uploader qu'un seul document"); return false;};
                                             //         var textAngular = this;
                                             //         var modalInstance = $modal.open({
                                             //             // Put a link to your template here or whatever
                                             //             templateUrl: APP_PATH+'/app/views/modal_upload_text_angular.html',
                                             //             size: 'sm',
                                             //             controller: 'UploadTextAngularCtrl'
                                             //         });

                                             //         modalInstance.result.then(function(upload) {

                                             //             textAngular.$editor().wrapSelection('upload', upload);
                                             //         });
                                             //         return false;
                                             //     }
                                             // });
                                             // // add the button to the default toolbar definition
                                             // taOptions.toolbar[7].push('upload');
                                             return taOptions;
                   } ] );

                   $provide.decorator( 'taTools',
                                       [ '$delegate',
                                         function( taTools ){
                                             taTools.html.buttontext = 'HTML';

                                             return taTools;
                                         } ] );
               } ] );
