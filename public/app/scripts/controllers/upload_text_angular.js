'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('UploadTextAngularCtrl',['$rootScope', '$modalInstance', '$scope', 'UPLOAD_SIZE', 'APP_PATH',
  function($rootScope, $modalInstance, $scope, UPLOAD_SIZE, APP_PATH) {
  	if ($rootScope.docs.length > 0) {alert("vous ne pouvez uploader qu'un seul document");$modalInstance.close(); };
  	$scope.document={};
  	$scope.upload_size = false;
  	$scope.upload = function($files){
  		if ($files[0].size <= UPLOAD_SIZE) {
  			$scope.document = $files[0];
  			$scope.upload_size = true;
  		} else {
  			$scope.upload_size = false;
  			alert("La taille du fichier ne doit pas dépasser 25Mo");
  		}
  	}

    $scope.valider = function() {
    	if ($scope.upload_size) {
	    	// $upload.upload({
		    //     url: APP_PATH + '/api/entrees/upload', //upload.php script, node.js route, or servlet url
		    //     method: 'POST',
		    //     // headers: {'Cookie': {suivi_api: JSON.stringify($cookies['suivi_api'])}},
		    //     withCredentials: true,
		    //     data: {id_carnet: $window.sessionStorage.getItem("id")},
		    //     file: $scope.document, // or list of files ($files) for html5 only
		    //     //fileName: 'doc.jpg' or ['$window.sessionStorage.getItem("prenom").jpg', '2.jpg', ...] // to modify the name of the file(s)
		    //     // customize file formData name ('Content-Disposition'), server side file variable name. 
		    //     //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
		    //     // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
		    //     //formDataAppender: function(formData, key, val){}
		    // }).success(function(data, status, headers, config) {
		        // file is uploaded successfully
		        $rootScope.docs.push({nom: $scope.document.name, md5: null, file: $scope.document });
		        // console.log(data);
		        // if (data['envoye'] != undefined && !_.isEmpty(data['envoye'])) {
		        //   $rootScope.resultats.success = data['envoye']
		        // };
		        // if (data['echoue'] != undefined && !_.isEmpty(data['echoue'])) {
		        //   $rootScope.resultats.echoue = data['echoue']
		        // };
		        // $scope.openResult();
		    // });    		
		};
    	$modalInstance.close();

    };
  }
]);