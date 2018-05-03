angular.module('suiviApp')
  .service('Utils',
           [ function() {
             let Utils = this;

             Utils.gen_pseudo_UUID = function() {
               return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                 let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                 return v.toString(16);
               });
             };
           }]);
