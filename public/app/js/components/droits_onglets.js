'use strict';

angular.module( 'suiviApp' )
    .component( 'droitsOnglets',
                { bindings: { droits: '=',
                              concernedPeople: '<' },
                  controller: [ 'DroitsOnglets', 'APIs', 'UID', 'URL_ENT',
                                function( DroitsOnglets, APIs, UID, URL_ENT ) {
                                    var ctrl = this;
                                    ctrl.sharing_enabled = false;

                                    var gen_pseudo_UUID = function() {
                                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                            return v.toString(16);
                                        });
                                    };

                                    ctrl.have_own_right = function() {
                                        return _.chain(ctrl.droits).findWhere({ own: true }).isUndefined();
                                    };

                                    ctrl.add = function( droit ) {
                                        droit.new = true;
                                        droit.dirty = { uid: _(droit).has('uid'),
                                                        profil_id: _(droit).has('profil_id'),
                                                        sharable_id: _(droit).has('sharable_id'),
                                                        read: true,
                                                        write: true };

                                        ctrl.droits.push( new DroitsOnglets( droit ) );
                                    };

                                    ctrl.add_sharable = function( droit ) {
                                        droit.sharable_id = gen_pseudo_UUID();
                                        ctrl.add( droit );
                                    };

                                    ctrl.set_read = function( droit ) {
                                        droit.write = !droit.read ? false : droit.write;
                                        if ( _(droit.dirty).isUndefined() ) {
                                            droit.dirty = {};
                                        }
                                        droit.dirty.write = true;
                                        droit.dirty.read = true;
                                    };

                                    ctrl.set_write = function( droit ) {
                                        droit.read = droit.write ? true : droit.read;
                                        if ( _(droit.dirty).isUndefined() ) {
                                            droit.dirty = {};
                                        }
                                        droit.dirty.read = true;
                                        droit.dirty.write = true;
                                    };

                                    ctrl.update_deletabilities = function() {
                                        var last_droit_standing = _(ctrl.droits).reject( function( droit ) { return droit.to_delete; } ).length == 1;

                                        _(ctrl.droits).each( function( droit ) {
                                            droit.deletable = !last_droit_standing;
                                            droit.deletable = droit.deletable && !droit.own;
                                        } );
                                    };

                                    ctrl.$onInit = function() {
                                        ctrl.UID = UID;

                                        ctrl.update_deletabilities();

                                        APIs.query_profiles_types()
                                            .then( function success( response ) {
                                                ctrl.profils = response.data;
                                            },
                                                   function error( response ) {} );
                                    };
                                } ],
                  template: `
<div>
    <label>Gestion des droits</label>
    <table style="width: 100%;">
        <tr style="text-align: right;"
            ng:repeat="droit in $ctrl.droits"
            ng:if="ctrl.sharing_enabled || !droit.sharable_id">
            <td>
                <label ng:if="droit.uid">Personne :
                    <select style="width: 250px;"
                            ng:model="droit.uid"
                            ng:change="droit.dirty.uid = true"
                            ng:disabled="droit.to_delete"
                            ng:options="people.id as people.firstname + ' ' + people.lastname group by people.type for people in $ctrl.concernedPeople">
                    </select>
                </label>
                <label ng:if="droit.profil_id">Profil :
                    <select style="width: 250px;"
                            ng:model="droit.profil_id"
                            ng:change="droit.dirty.profil_id = true"
                            ng:disabled="droit.to_delete">
                        <option ng:repeat="profil in $ctrl.profils track by profil.id"
                                ng:value="profil.id">{{profil.name}}</option>
                    </select>
                </label>
                <label ng:if="droit.sharable_id">Partage :
                    <input style="width: 250px;"
                           type="text"
                           ng:model="droit.sharable_id"
                           ng:change="droit.dirty.sharable_id = true"
                           ng:disabled="droit.to_delete" />
                </label>
            </td>
            <td>
                <button type="button" class="btn"
                        ng:class="{'btn-default': !droit.read, 'btn-success': droit.read}"
                        ng:model="droit.read"
                        ng:change="$ctrl.set_read( droit )"
                        ng:disabled="droit.to_delete || droit.sharable_id"
                        uib:btn-checkbox
                        btn-checkbox-true="true"
                        btn-checkbox-false="false"
                        uib:tooltip="droit de lecture">
                    <span class="glyphicon glyphicon-eye-open"></span>
                </button>
            </td>
            <td>
                <button type="button" class="btn"
                        ng:class="{'btn-default': !droit.write, 'btn-success': droit.write}"
                        ng:model="droit.write"
                        ng:change="$ctrl.set_write( droit )"
                        ng:disabled="droit.to_delete || droit.sharable_id"
                        uib:btn-checkbox
                        btn-checkbox-true="true"
                        btn-checkbox-false="false"
                        uib:tooltip="droit d'écriture">
                    <span class="glyphicon glyphicon-edit"></span>
                </button>
            </td>
            <td>
                <button type="button" class="btn"
                        ng:class="{'btn-default': !droit.to_delete, 'btn-warning': droit.to_delete}"
                        ng:disabled="!droit.deletable && !droit.to_delete"
                        ng:model="droit.to_delete"
                        ng:change="$ctrl.update_deletabilities()"
                        uib:btn-checkbox
                        btn-checkbox-true="true"
                        btn-checkbox-false="false">
                    <span class="glyphicon glyphicon-trash"></span>
                </button>
            </td>
        </tr>
        <tfoot>
            <td colspan="3">
                <button class="btn btn-default"
                        ng:click="$ctrl.add({ uid: '...', read: true, write: true })">
                    <span class="glyphicon glyphicon-plus-sign"></span> par personne
                </button>

                <button class="btn btn-default"
                        ng:click="$ctrl.add({ profil_id: '...', read: true, write: false })">
                    <span class="glyphicon glyphicon-plus-sign"></span> par profil
                </button>

                <button class="btn btn-warning pull-right"
                        ng:if="ctrl.sharing_enabled"
                        ng:click="$ctrl.add_sharable({ read: true, write: false })">
                    <span class="glyphicon glyphicon-plus-sign"></span> partage
                </button>
            </td>
        </tfoot>
    </table>
</div>
`
                } );
