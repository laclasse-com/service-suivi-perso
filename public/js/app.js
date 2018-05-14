var BASE_SERVICE_URL = '/api';
var APPLICATION_PREFIX = location.pathname;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Suivi;
(function (Suivi) {
    var APIs;
    (function (APIs) {
        var APIS_ROOT = APPLICATION_PREFIX + "/api";
        function send_async_request(params) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = new Core.HttpRequest(params);
                            return [4, request.sendAsync()];
                        case 1:
                            _a.sent();
                            return [2, request.responseText];
                    }
                });
            });
        }
        function serialize_params(params, param_name) {
            return params.map(function (param) { return param_name + "=" + param; }).join('&');
        }
        var Student;
        (function (Student) {
            var STUDENTS_APIS_ROOT = APIS_ROOT + "/students";
            function get_relevant_users(uid) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: STUDENTS_APIS_ROOT + "/relevant/" + uid })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Student.get_relevant_users = get_relevant_users;
        })(Student = APIs.Student || (APIs.Student = {}));
        var Tab;
        (function (Tab) {
            var TABS_API = APIS_ROOT + "/onglets";
            function get(id) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: TABS_API + "/" + id })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Tab.get = get;
            function query(uids) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: TABS_API + "/?" + serialize_params(uids, 'uids[]') })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Tab.query = query;
            function post(uids, names) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: TABS_API + "/",
                                        method: 'POST',
                                        arguments: { uids: uids,
                                            names: names } })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Tab.post = post;
            function put(id, name) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: TABS_API + "/" + id,
                                        method: 'PUT',
                                        arguments: { name: name } })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Tab.put = put;
            function drop(id, ids) {
                return __awaiter(this, void 0, void 0, function () {
                    var params, request;
                    return __generator(this, function (_a) {
                        if (id != null) {
                            params = { url: TABS_API + "/" + id,
                                method: 'DELETE' };
                        }
                        else if (ids != null) {
                            params = { url: TABS_API + "/",
                                method: 'DELETE',
                                arguments: { ids: ids } };
                        }
                        if (params != null) {
                            request = new Core.HttpRequest(params);
                            request.send();
                        }
                        return [2];
                    });
                });
            }
            Tab.drop = drop;
        })(Tab = APIs.Tab || (APIs.Tab = {}));
        var Message;
        (function (Message) {
            var MESSAGES_API = APIS_ROOT + "/saisies";
            function get(id) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: MESSAGES_API + "/" + id })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Message.get = get;
            function query(tabs_ids) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: MESSAGES_API + "/?" + serialize_params(tabs_ids, 'onglets_ids[]') })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Message.query = query;
            function post(tabs_ids, content, pinned) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: MESSAGES_API + "/",
                                        method: 'POST',
                                        arguments: { tabs_ids: tabs_ids,
                                            content: content,
                                            pinned: pinned } })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Message.post = post;
            function put(tabs_ids, content, pinned) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: MESSAGES_API + "/",
                                        method: 'PUT',
                                        arguments: { tabs_ids: tabs_ids,
                                            content: content,
                                            pinned: pinned } })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Message.put = put;
            function drop(id, tabs_ids) {
                return __awaiter(this, void 0, void 0, function () {
                    var request;
                    return __generator(this, function (_a) {
                        request = new Core.HttpRequest({ url: MESSAGES_API + "/" + id,
                            method: 'DELETE',
                            arguments: { onglets_ids: tabs_ids } });
                        request.send();
                        return [2];
                    });
                });
            }
            Message.drop = drop;
        })(Message = APIs.Message || (APIs.Message = {}));
        var Right;
        (function (Right) {
            var RIGHTS_API = APIS_ROOT + "/droits";
            function get(tab_id) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: RIGHTS_API + "/" + tab_id })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Right.get = get;
            function query(tabs_ids) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: RIGHTS_API + "/?" + serialize_params(tabs_ids, 'onglets_ids[]') })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Right.query = query;
            function post(tabs_ids, payload) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                payload.onglet_ids = tabs_ids;
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: RIGHTS_API + "/",
                                        method: 'POST',
                                        arguments: payload })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Right.post = post;
            function put(payload, id, ids) {
                return __awaiter(this, void 0, void 0, function () {
                    var params, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (id != null) {
                                    params = { url: RIGHTS_API + "/" + id,
                                        method: 'PUT',
                                        arguments: payload };
                                }
                                else if (ids != null) {
                                    payload.ids = ids;
                                    params = { url: RIGHTS_API + "/",
                                        method: 'PUT',
                                        arguments: payload };
                                }
                                _b = (_a = JSON).parse;
                                return [4, send_async_request(params)];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Right.put = put;
            function drop(id, ids) {
                return __awaiter(this, void 0, void 0, function () {
                    var params, request;
                    return __generator(this, function (_a) {
                        if (id != null) {
                            params = { url: RIGHTS_API + "/" + id,
                                method: 'DELETE' };
                        }
                        else if (ids != null) {
                            params = { url: RIGHTS_API + "/",
                                method: 'DELETE',
                                arguments: { ids: ids } };
                        }
                        if (params != null) {
                            request = new Core.HttpRequest(params);
                            request.send();
                        }
                        return [2];
                    });
                });
            }
            Right.drop = drop;
        })(Right = APIs.Right || (APIs.Right = {}));
        var Sharable;
        (function (Sharable) {
            var SHARABLE_API = APIS_ROOT + "/sharable";
            function get(id) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4, send_async_request({ url: SHARABLE_API + "/" + id })];
                            case 1: return [2, _b.apply(_a, [_c.sent()])];
                        }
                    });
                });
            }
            Sharable.get = get;
        })(Sharable = APIs.Sharable || (APIs.Sharable = {}));
        var LaClasse;
        (function (LaClasse) {
            var ProfilesTypes;
            (function (ProfilesTypes) {
                var PROFILES_TYPES_API = BASE_SERVICE_URL + "/profiles_types/";
                function query() {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: PROFILES_TYPES_API })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                ProfilesTypes.query = query;
            })(ProfilesTypes = LaClasse.ProfilesTypes || (LaClasse.ProfilesTypes = {}));
            var Users;
            (function (Users) {
                var USERS_API = BASE_SERVICE_URL + "/users";
                function query(uids) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: USERS_API + "/?" + serialize_params(uids, 'id[]') })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Users.query = query;
            })(Users = LaClasse.Users || (LaClasse.Users = {}));
            var Groups;
            (function (Groups) {
                var GROUPS_API = BASE_SERVICE_URL + "/groups";
                function get(id) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: GROUPS_API + "/" + id })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Groups.get = get;
                function query(ids) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: GROUPS_API + "/?" + serialize_params(ids, 'id[]') })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Groups.query = query;
                function query_structures(structures_ids) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: GROUPS_API + "/?" + serialize_params(structures_ids, 'structure_id[]') })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Groups.query_structures = query_structures;
            })(Groups = LaClasse.Groups || (LaClasse.Groups = {}));
            var Grades;
            (function (Grades) {
                var GRADES_API = BASE_SERVICE_URL + "/grades";
                function query(ids) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: GRADES_API + "/?" + serialize_params(ids, 'id[]') })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Grades.query = query;
            })(Grades = LaClasse.Grades || (LaClasse.Grades = {}));
            var Subjects;
            (function (Subjects) {
                var SUBJECTS_API = BASE_SERVICE_URL + "/subjects";
                function query(ids) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: SUBJECTS_API + "/?" + serialize_params(ids, 'id[]') })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Subjects.query = query;
            })(Subjects = LaClasse.Subjects || (LaClasse.Subjects = {}));
            var Structures;
            (function (Structures) {
                var STRUCTURES_API = BASE_SERVICE_URL + "/structures";
                function get(uai) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: STRUCTURES_API + "/" + uai })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Structures.get = get;
                function query(uais) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = JSON).parse;
                                    return [4, send_async_request({ url: STRUCTURES_API + "/?" + serialize_params(uais, 'id[]') })];
                                case 1: return [2, _b.apply(_a, [_c.sent()])];
                            }
                        });
                    });
                }
                Structures.query = query;
            })(Structures = LaClasse.Structures || (LaClasse.Structures = {}));
        })(LaClasse = APIs.LaClasse || (APIs.LaClasse = {}));
    })(APIs = Suivi.APIs || (Suivi.APIs = {}));
})(Suivi || (Suivi = {}));
var uids;
Suivi.APIs.Student.get_relevant_users("VBM69696")
    .then(function (response) {
    uids = response;
    Suivi.APIs.Tab.query(uids)
        .then(function (response) { return console.log(response); });
});
