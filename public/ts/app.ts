/// <reference path="../../../erats/era/era.d.ts" />
/// <reference path="./config.ts" />
/// <reference path="./lib/apis.ts" />
/// <reference path="./lib/utils.ts" />

console.log( Suivi.Utils.gen_pseudo_UUID() );

let uids: Array<string>;

Suivi.APIs.LaClasse.Users.current()
  .then((response) => {
    console.log(response);
  });

// Suivi.APIs.Student.get_relevant_users( "VBM69696")
//   .then((response) => {
//     uids = response;

//     Suivi.APIs.Tab.query( uids )
//       .then((response) => console.log( response ) );
//   } );

// Suivi.APIs.Tab.get( 98 )
//   .then((response) => console.log( response ) );
