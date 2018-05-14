/// <reference path="../../../../erats/era/era.d.ts" />
/// <reference path="../config.ts" />

namespace Suivi.APIs {
  const APIS_ROOT = `${APPLICATION_PREFIX}/api`;

  async function send_async_request( params: Core.HttpRequestInit ) : Promise<string> {
    let request = new Core.HttpRequest( params );
    await request.sendAsync();
    return request.responseText;
  }

  function serialize_params( params : Array<any>, param_name : string ) : string {
    return params.map((param) => `${param_name}=${param}`).join('&');
  }

  export namespace Student {
    const STUDENTS_APIS_ROOT = `${APIS_ROOT}/students`;

    export async function get_relevant_users( uid : string ) : Promise<Array<string>> {
      return JSON.parse( await send_async_request({ url: `${STUDENTS_APIS_ROOT}/relevant/${uid}` }) );
    }
  }

  export namespace Tab {
    const TABS_API = `${APIS_ROOT}/onglets`;

    export type tab = { id? : number,
                        name : string,
                        ctime? : string,
                        uid_student? : string };

    export async function get( id : number ) : Promise<tab> {
      return JSON.parse( await send_async_request({ url: `${TABS_API}/${id}` }) );
    }

    export async function query( uids : Array<string> ) : Promise<Array<tab>> {
      return JSON.parse( await send_async_request({ url: `${TABS_API}/?${serialize_params( uids, 'uids[]' )}` }) );
    }

    export async function post( uids : Array<string>, names : Array<string> ) : Promise<Array<tab>> {
      return JSON.parse( await send_async_request({ url: `${TABS_API}/`,
                                                    method: 'POST',
                                                    arguments: { uids: uids,
                                                                 names: names } }) );
    }

    export async function put( id : number, name : string ) : Promise<tab> {
      return JSON.parse( await send_async_request({ url: `${TABS_API}/${id}`,
                                                    method: 'PUT',
                                                    arguments: { name: name } }) );
    }

    export async function drop( id? : number, ids? : Array<number> ) {
      let params: Core.HttpRequestInit;

      if ( id != null ) {
        params = { url: `${TABS_API}/${id}`,
                   method: 'DELETE' };
      } else if ( ids != null ) {
        params = { url: `${TABS_API}/`,
                   method: 'DELETE',
                   arguments: { ids: ids } };
      }

      if ( params != null ) {
        let request = new Core.HttpRequest( params );
        request.send();
      }
    }
  }

  export namespace Message {
    const MESSAGES_API = `${APIS_ROOT}/saisies`;

    export type message = { id? : number,
                            uid_author : string,
                            content : string,
                            pinned : boolean,
                            ctime? : string,
                            mtime? : string };

    export async function get( id : number ) : Promise<message> {
      return JSON.parse( await send_async_request({ url: `${MESSAGES_API}/${id}` }) );
    }

    export async function query( tabs_ids : Array<number> ) : Promise<Array<message>> {
      return JSON.parse( await send_async_request({ url: `${MESSAGES_API}/?${serialize_params( tabs_ids, 'onglets_ids[]' )}` }) );
    }

    export async function post( tabs_ids : Array<number>, content : string, pinned : boolean ) : Promise<message> {
      return JSON.parse( await send_async_request({ url: `${MESSAGES_API}/`,
                                                    method: 'POST',
                                                    arguments: { tabs_ids: tabs_ids,
                                                                 content: content,
                                                                 pinned: pinned } }) );
    }

    export async function put( tabs_ids : Array<number>, content : string, pinned : boolean ) : Promise<message> {
      return JSON.parse( await send_async_request({ url: `${MESSAGES_API}/`,
                                                    method: 'PUT',
                                                    arguments: { tabs_ids: tabs_ids,
                                                                 content: content,
                                                                 pinned: pinned } }) );
    }

    export async function drop( id : number, tabs_ids : Array<number> ) {
      let request = new Core.HttpRequest({ url: `${MESSAGES_API}/${id}`,
                                           method: 'DELETE',
                                           arguments: { onglets_ids: tabs_ids } });
      request.send();
    }
  }

  export namespace Right {
    const RIGHTS_API = `${APIS_ROOT}/droits`;

    export type right = { id? : number,
                          ids? : Array<number>,
                          onglet_ids? : Array<number>,
                          read : boolean,
                          write : boolean,
                          manage : boolean,
                          uid? : string,
                          profile_type? : string,
                          group_id? : string,
                          sharable_id? : string };

    export async function get( tab_id : number ) : Promise<Array<right>> {
      return JSON.parse( await send_async_request({ url: `${RIGHTS_API}/${tab_id}` }) );
    }

    export async function query( tabs_ids : Array<number> ) : Promise<Array<right>> {
      return JSON.parse( await send_async_request({ url: `${RIGHTS_API}/?${serialize_params( tabs_ids, 'onglets_ids[]' )}` }) );
    }

    export async function post( tabs_ids : Array<number>, payload : right ) : Promise<Array<right>> {
      payload.onglet_ids = tabs_ids;

      return JSON.parse( await send_async_request( { url: `${RIGHTS_API}/`,
                                                     method: 'POST',
                                                     arguments: payload } ) );
    }

    export async function put( payload : right, id? : number, ids? : Array<number> ) : Promise<right|Array<right>> {
      let params: Core.HttpRequestInit;

      if ( id != null ) {
        params = { url: `${RIGHTS_API}/${id}`,
                   method: 'PUT',
                   arguments: payload };
      } else if ( ids != null ) {
        payload.ids = ids;
        params = { url: `${RIGHTS_API}/`,
                   method: 'PUT',
                   arguments: payload };
      }

      return JSON.parse( await send_async_request( params ) );
    }

    export async function drop( id? : number, ids? : Array<number> ) {
      let params: Core.HttpRequestInit;

      if ( id != null ) {
        params = { url: `${RIGHTS_API}/${id}`,
                   method: 'DELETE' };
      } else if ( ids != null ) {
        params = { url: `${RIGHTS_API}/`,
                   method: 'DELETE',
                   arguments: { ids: ids } };
      }

      if ( params != null ) {
        let request = new Core.HttpRequest( params );
        request.send();
      }
    }
  }

  export namespace Sharable {
    const SHARABLE_API = `${APIS_ROOT}/sharable`;

    export async function get( id : string ) : Promise<Array<Suivi.APIs.Tab.tab>> {
      return JSON.parse( await send_async_request({ url: `${SHARABLE_API}/${id}` }) );
    }
  }

  export namespace LaClasse {
    export namespace ProfilesTypes {
      const PROFILES_TYPES_API = `${BASE_SERVICE_URL}/profiles_types/`;

      export type profile_type = { id: string,
                                   name: string,
                                   code_national: string };

      export async function query() : Promise<Array<profile_type>> {
        return JSON.parse( await send_async_request({ url: PROFILES_TYPES_API }) );
      }
    }

    export namespace Users {
      const USERS_API = `${BASE_SERVICE_URL}/users`;

      export type user = { id: string };

      export async function query( uids : Array<string> ) : Promise<Array<user>> {
        return JSON.parse( await send_async_request({ url: `${USERS_API}/?${serialize_params( uids, 'id[]' )}` }) );
      }
    }

    export namespace Groups {
      const GROUPS_API = `${BASE_SERVICE_URL}/groups`;

      export type group = { id: number,
                            name: string,
                            description? : string,
                            aaf_mtime? : string,
                            aaf_name? : string,
                            type : string,
                            ctime : string,
                            structure_id? : string,
                            grades? : Array<Suivi.APIs.LaClasse.Grades.grade>,
                            users? : Array<Suivi.APIs.LaClasse.Users.user> }

      export async function get( id : number ) : Promise<group> {
        return JSON.parse( await send_async_request({ url: `${GROUPS_API}/${id}` }) );
      }

      export async function query( ids : Array<number> ) : Promise<Array<group>> {
        return JSON.parse( await send_async_request({ url: `${GROUPS_API}/?${serialize_params( ids, 'id[]' )}` }) );
      }

      export async function query_structures( structures_ids : Array<string> ) : Promise<Array<group>> {
        return JSON.parse( await send_async_request({ url: `${GROUPS_API}/?${serialize_params( structures_ids, 'structure_id[]' )}` }) );
      }
    }

    export namespace Grades {
      const GRADES_API = `${BASE_SERVICE_URL}/grades`;

      export type grade = { id: string,
                            name: string,
                            rattach: string,
                            stat: string };

      export async function query( ids : Array<string> ) : Promise<Array<grade>> {
        return JSON.parse( await send_async_request({ url: `${GRADES_API}/?${serialize_params( ids, 'id[]' )}` }) );
      }
    }

    export namespace Subjects {
      const SUBJECTS_API = `${BASE_SERVICE_URL}/subjects`;

      export type subject = { id: string,
                              name: string };

      export async function query( ids : Array<string> ) : Promise<Array<subject>> {
        return JSON.parse( await send_async_request({ url: `${SUBJECTS_API}/?${serialize_params( ids, 'id[]' )}` }) );
      }
    }

    export namespace Structures {
      const STRUCTURES_API = `${BASE_SERVICE_URL}/structures`;

      export type structure = { id? : string,
                                name? : string,
                                siren? : string,
                                address? : string,
                                zip_code? : string,
                                city? : string,
                                phone? : string,
                                fax? : string,
                                longitude? : number,
                                latitude? : number,
                                aaf_mtime? : string,
                                domain? : string,
                                public_ip? : string,
                                type? : number,
                                private_ip? : string,
                                educnat_marking_id? : string,
                                aaf_sync_activated : boolean,
                                aaf_jointure_id? : number,
                                groups: Array<Suivi.APIs.LaClasse.Groups.group>,
                                // FIXME
                                resources: Array<any>
                                // FIXME
                                profiles: Array<any> };

      export async function get( uai : string ) : Promise<structure> {
        return JSON.parse( await send_async_request({ url: `${STRUCTURES_API}/${uai}` }) );
      }

      export async function query( uais : Array<string> ) : Promise<Array<structure>> {
        return JSON.parse( await send_async_request({ url: `${STRUCTURES_API}/?${serialize_params( uais, 'id[]' )}` }) );
      }
    }
  }
}
