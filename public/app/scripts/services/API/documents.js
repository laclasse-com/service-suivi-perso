'use strict';

angular.module('suiviApp')
.service('Documents',
	[ '$http', 'APP_PATH',
		function( $http, APP_PATH ) {
			this.list_files = function( root ) {
			   root = typeof root === 'undefined' ? '&init=1' : root;
			   return $http.get( APP_PATH + '/api/docs?cmd=open&target=' + root );
			};
		}
	]
);