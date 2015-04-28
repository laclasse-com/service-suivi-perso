'use strict';

angular.module('suiviApp')
.factory( 'RecursionHelper',
	[ '$compile',
		function( $compile ){
		    return {
				/**
				 * Manually compiles the element, fixing the recursion loop.
				 * @param element
				 * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
				 * @returns An object containing the linking functions.
				 */
				compile: function(element, link){
				    // Normalize the link parameter
				    if( angular.isFunction( link ) ) {
						link = { post: link };
				    }

				    // Break the recursion loop by removing the contents
				    var contents = element.contents().remove();
				    var compiledContents;
				    return {
						pre: (link && link.pre) ? link.pre : null,
						/**
						 * Compiles and re-adds the contents
						 */
						post: function( scope, element ){
						    // Compile the contents
						    if ( !compiledContents ) {
								compiledContents = $compile( contents );
						    }
						    // Re-add the compiled contents to the element
						    compiledContents( scope, function( clone ) {
								element.append(clone);
						    } );

						    // Call the post-linking function, if any
						    if( link && link.post ) {
								link.post.apply( null, arguments );
						    }
						}
			    	};
				}
		    };
		}
	]
)
.directive( 'cartable',
	[ 'RecursionHelper',
	  	function( RecursionHelper ) {
	      	return {
				scope: {
					racine: '=racine',
				},
				replace: true,
				controller: [ '$scope', '$rootScope', 'Documents',
					function( $scope, $rootScope, Documents ) {
					    $scope.getChildren = function( noeud ) {
							Documents.list_files( noeud.hash ).then( function ( response ) {
							    noeud.children = _( response.data.files ).rest();
							} );
					    };

					    $scope.uploadDocs = function(nom, target){
							$rootScope.document.nom = nom;
							$rootScope.document.file = target;
							$rootScope.document.cartable = true;
					  	};
					}
				],
				 template: ' \
<ul class="cartable"> \
  <li data-ng-repeat="node in racine" \
      data-ng-class="{\'disabled\': node.name == \'Cahier de textes.ct\'}" \
      style="list-style-type: none"> \
    <span class="glyphicon" \
	  data-ng-class="{\'glyphicon-folder-open\': node.children, \'glyphicon-folder-close\': !node.children}" \
	  data-ng-if="node.mime ==  \'directory\'" \
			  data-ng-click="getChildren( node )"> \
			  {{node.name}} \
			  </span> \
			      <button class="btn btn-sm btn-success from-docs" \
			  style="padding-top: 0; padding-bottom: 0" \
			  data-ng-if="node.mime != \'directory\'" \
			  data-ng-click="uploadDocs( node.name, node.hash )"> \
      <span class="glyphicon glyphicon-plus"></span> \
    </button> \
    <button class="btn btn-sm btn-success from-ct" \
			  style="padding-top: 0; padding-bottom: 0" \
			  data-ng-if="node.mime != \'directory\'" \
			  data-ng-click="uploadDocs( node.name, node.hash )"> \
      <span class="glyphicon glyphicon-plus"></span> \
    </button> \
			      <span class="glyphicon glyphicon-file" data-ng-if="node.mime != \'directory\'"> \
			  {{node.name}} \
			  </span> \
			      <div cartable \
	 data-ng-if="node.mime ==  \'directory\'" \
	 data-racine="node.children" >\
    </div> \
  </li> \
</ul>',
				compile: RecursionHelper.compile
	      	};
	  	} 
	] 
);