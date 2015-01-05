'use strict';

angular.module('suiviApp')
.constant('AVATAR_M', '/app/bower_components/charte-graphique-laclasse-com/images/avatar_masculin.svg')
.constant('AVATAR_F', '/app/bower_components/charte-graphique-laclasse-com/images/avatar_feminin.svg')
.constant('AVATAR_DEFAULT', '/api/default_avatar/avatar_neutre.svg')
.constant('UAI_EVIGNAL', "0692165D")
.constant('GRID_COLOR', ['jaune', 'rouge', 'bleu', 'violet', 'bleu', 'violet', 'vert', 'jaune', 'vert', 'jaune', 'rouge', 'bleu', 'rouge', 'bleu', 'violet', 'vert'])
.config(['$provide', 'APP_PATH', function($provide, APP_PATH){
	$provide.decorator('taOptions', ['taRegisterTool', '$modal', '$delegate', function(taRegisterTool, $modal, taOptions){
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('upload', {
            display: '<button type="button" class="btn btn-default ng-scope" name="upload" title="insérer un fichier de son cartable ou non" unselectable="on" ng-disabled="isDisabled()" tabindex="-1" ng-click="executeAction()" ng-class="displayActiveToolClass(active)"><i class="glyphicon glyphicon-briefcase"></i></button>',
            action: function(){
              var textAngular = this;
              var modalInstance = $modal.open({
                // Put a link to your template here or whatever
                templateUrl: APP_PATH+'/app/views/modals/upload_text_angular.html',
                size: 'sm',
                controller: 'UploadTextAngularCtrl'
              });

              modalInstance.result.then(function(upload) {

                textAngular.$editor().wrapSelection('upload', upload);
              });
              return false;
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('upload');
        return taOptions;
    }]);
}]);