/// <reference path="../../../erats/era/era.d.ts" />
declare const BASE_SERVICE_URL = "/api";
declare const APPLICATION_PREFIX: string;
declare namespace Suivi.APIs {
    namespace Student {
        function get_relevant_users(uid: string): Promise<Array<string>>;
    }
    namespace Tab {
        type tab = {
            id?: number;
            name: string;
            ctime?: string;
            uid_student?: string;
        };
        function get(id: number): Promise<tab>;
        function query(uids: Array<string>): Promise<Array<tab>>;
        function post(uids: Array<string>, names: Array<string>): Promise<Array<tab>>;
        function put(id: number, name: string): Promise<tab>;
        function drop(id?: number, ids?: Array<number>): Promise<void>;
    }
    namespace Message {
        type message = {
            id?: number;
            uid_author: string;
            content: string;
            pinned: boolean;
            ctime?: string;
            mtime?: string;
        };
        function get(id: number): Promise<message>;
        function query(tabs_ids: Array<number>): Promise<Array<message>>;
        function post(tabs_ids: Array<number>, content: string, pinned: boolean): Promise<message>;
        function put(tabs_ids: Array<number>, content: string, pinned: boolean): Promise<message>;
        function drop(id: number, tabs_ids: Array<number>): Promise<void>;
    }
    namespace Right {
        type right = {
            id?: number;
            ids?: Array<number>;
            onglet_ids?: Array<number>;
            read: boolean;
            write: boolean;
            manage: boolean;
            uid?: string;
            profile_type?: string;
            group_id?: string;
            sharable_id?: string;
        };
        function get(tab_id: number): Promise<Array<right>>;
        function query(tabs_ids: Array<number>): Promise<Array<right>>;
        function post(tabs_ids: Array<number>, payload: right): Promise<Array<right>>;
        function put(payload: right, id?: number, ids?: Array<number>): Promise<right | Array<right>>;
        function drop(id?: number, ids?: Array<number>): Promise<void>;
    }
    namespace Sharable {
        function get(id: string): Promise<Array<Suivi.APIs.Tab.tab>>;
    }
    namespace LaClasse {
        namespace ProfilesTypes {
            type profile_type = {
                id: string;
                name: string;
                code_national: string;
            };
            function query(): Promise<Array<profile_type>>;
        }
        namespace Users {
            type user = {
                id: string;
                login: string;
                firstname: string;
                lastname: string;
                birthdate?: string;
                gender: string;
                address?: string;
                zip_code: string;
                city?: string;
                country?: string;
                aaf_jointure_id?: string;
                aaf_struct_rattach_id?: string;
                atime?: string;
                avatar?: string;
                children?: Array<any>;
                children_groups?: Array<any>;
                ctime?: string;
                email_backend_id?: number;
                emails?: Array<any>;
                groups?: Array<any>;
                last_idp?: string;
                oidc_sso_id?: string;
                parents?: Array<any>;
                phones?: Array<any>;
                profiles?: Array<any>;
                student_grade_id?: string;
                super_admin?: boolean;
            };
            function current(): Promise<user>;
            function query(uids: Array<string>): Promise<Array<user>>;
        }
        namespace Groups {
            type group = {
                id: number;
                name: string;
                description?: string;
                aaf_mtime?: string;
                aaf_name?: string;
                type: string;
                ctime: string;
                structure_id?: string;
                grades?: Array<Suivi.APIs.LaClasse.Grades.grade>;
                users?: Array<Suivi.APIs.LaClasse.Users.user>;
            };
            function get(id: number): Promise<group>;
            function query(ids: Array<number>): Promise<Array<group>>;
            function query_structures(structures_ids: Array<string>): Promise<Array<group>>;
        }
        namespace Grades {
            type grade = {
                id: string;
                name: string;
                rattach: string;
                stat: string;
            };
            function query(ids: Array<string>): Promise<Array<grade>>;
        }
        namespace Subjects {
            type subject = {
                id: string;
                name: string;
            };
            function query(ids: Array<string>): Promise<Array<subject>>;
        }
        namespace Structures {
            type structure = {
                id?: string;
                name?: string;
                siren?: string;
                address?: string;
                zip_code?: string;
                city?: string;
                phone?: string;
                fax?: string;
                longitude?: number;
                latitude?: number;
                aaf_mtime?: string;
                domain?: string;
                public_ip?: string;
                type?: number;
                private_ip?: string;
                educnat_marking_id?: string;
                aaf_sync_activated: boolean;
                aaf_jointure_id?: number;
                groups: Array<Suivi.APIs.LaClasse.Groups.group>;
                resources: Array<any>;
                profiles: Array<any>;
            };
            function get(uai: string): Promise<structure>;
            function query(uais: Array<string>): Promise<Array<structure>>;
        }
    }
}
declare namespace Suivi.Utils {
    function gen_pseudo_UUID(): string;
}
declare let uids: Array<string>;
