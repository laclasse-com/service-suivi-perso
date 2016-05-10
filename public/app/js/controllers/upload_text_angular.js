'use strict';

/* Controllers */

angular.module('suiviApp')
.controller('UploadTextAngularCtrl',['$rootScope', '$modalInstance', '$scope', 'UPLOAD_SIZE', 'APP_PATH', 'Documents',
  function($rootScope, $modalInstance, $scope, UPLOAD_SIZE, APP_PATH, Documents) {

  	$scope.cartable = {};
	$scope.cartable.expandedNodes = [];
	$scope.treeOptions = {
		dirSelectable: false
	};

  	$rootScope.document={nom: null, md5: null, file: null, cartable: false};
  	$scope.upload_size = false;
  	$scope.upload = function($files){
  		if ($files[0].size <= UPLOAD_SIZE) {
  			$rootScope.document.file = $files[0];
  			$rootScope.document.nom = $files[0].name;
  			$rootScope.document.cartable = false;
  			$scope.upload_size = true;
  			$files = null;
  		} else {
  			$scope.upload_size = false;
  			alert("La taille du fichier ne doit pas dépasser 25Mo");
  		}
  	}

  	var dead_Documents = function() {
		$scope.erreurs.push( { message: "Application Documents non disponible" } );
		$scope.faulty_docs_app = true;
	};

  	Documents.list_files()
	.success( function ( response ) {
	   if ( _(response.error).isEmpty() && _(response).has( 'files' ) ) {
	   $scope.cartable = response;
	   $scope.cartable.files = _( response.files ).reject( function( file ) {
           return _(file).has( 'phash' );
       } ); //.rest();
	   $scope.cartable.expandedNodes = [];
	   } else {
	   dead_Documents();
	   }
	} )
	.error( dead_Documents );

    $scope.valider = function() {
    	if ($scope.upload_size || $rootScope.document.cartable) {
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
		        $rootScope.docs.push($rootScope.document);
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