'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reducerMap;

var _immutable = require('immutable');

var _actionNames = require('./action-names');

var _actionNames2 = _interopRequireDefault(_actionNames);

var _jsonApiTransformer = require('./json-api-transformer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reducerMap = (_reducerMap = {}, _defineProperty(_reducerMap, _actionNames2.default.LOAD_JSON_API_ENTITY_DATA, function (state, action) {
    return (0, _jsonApiTransformer.insertOrUpdateEntities)(state, action.data);
}), _defineProperty(_reducerMap, _actionNames2.default.ADD_RELATIONSHIP_TO_ENTITY, function (state, action) {
    return (0, _jsonApiTransformer.addRelationshipToEntity)(state, action.entityKey, action.entityId, action.relationshipKey, action.relationshipObject);
}), _defineProperty(_reducerMap, _actionNames2.default.REMOVE_RELATIONSHIP_FROM_ENTITY, function (state, action) {
    return (0, _jsonApiTransformer.removeRelationshipFromEntity)(state, action.entityKey, action.entityId, action.relationshipKey, action.relationshipId);
}), _defineProperty(_reducerMap, _actionNames2.default.UPDATE_ENTITIES_META, function (state, action) {
    return (0, _jsonApiTransformer.updateEntitiesMeta)(state, action.entityKey, action.metaKey, action.value);
}), _defineProperty(_reducerMap, _actionNames2.default.UPDATE_ENTITY_META, function (state, action) {
    return (0, _jsonApiTransformer.updateEntityMeta)(state, action.entityKey, action.entityId, action.metaKey, action.value);
}), _defineProperty(_reducerMap, _actionNames2.default.UPDATE_ENTITY, function (state, action) {
    return (0, _jsonApiTransformer.updateEntity)(state, action.entityKey, action.entityId, action.data);
}), _defineProperty(_reducerMap, _actionNames2.default.REMOVE_ENTITY, function (state, action) {
    return (0, _jsonApiTransformer.removeEntity)(state, action.entityKey, action.entityId);
}), _defineProperty(_reducerMap, _actionNames2.default.CLEAR_ENTITY_TYPE, function (state, action) {
    return (0, _jsonApiTransformer.clearEntityType)(state, action.entityKey, action.entityId);
}), _defineProperty(_reducerMap, 'default', function _default(state) {
    return state;
}), _reducerMap);

/**
 * The giadc-redux-json-api reducer
 *
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var actionKey = action && Object.keys(reducerMap).find(function (key) {
        return action.type && action.type.match(new RegExp('^' + key + '(_[_A-Z]+)?$'));
    });

    if (actionKey) {
        return reducerMap[actionKey](_immutable.Map.isMap(state) ? state : convertTopImmutable(state), action);
    }

    return reducerMap.default(_immutable.Map.isMap(state) ? state : convertTopImmutable(state), action);
};

/**
 * Converts a JS Object to an Immutable
 * data structure composed of Maps and Sets
 *
 * @param  {Object} state
 * @return {Map}
 */


var convertTopImmutable = function convertTopImmutable(state) {
    return (0, _immutable.fromJS)(state, function (key, value) {
        return Array.isArray(value.toJS()) ? value.toSet() : value.toMap();
    });
};