'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateEntity = exports.getEntityMeta = exports.getEntitiesMeta = exports.getIds = exports.getId = exports.getEntities = exports.getEntity = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Grab an Entity from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
var getEntity = exports.getEntity = function getEntity(state, key, id) {
    var pluralKey = (0, _pluralize2.default)(key);
    var entity = state.getIn([pluralKey, 'byId', id, 'data']);

    return entity === undefined ? undefined : _extends({}, entity.toJS(), {
        id: id
    });
};

/**
 * Get an array of Entities from the state
 *
 * @param  {Object}     state
 * @param  {String}     key
 * @param  {Array|null} ids
 * @return {Array}
 */
var getEntities = exports.getEntities = function getEntities(state, key) {
    var ids = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var pluralKey = (0, _pluralize2.default)(key);

    if (ids === null) {
        if (!state.hasIn([pluralKey, 'byId'])) {
            return [];
        }

        var idsToFetch = state.getIn([pluralKey, 'byId']).keySeq().toArray();

        return idsToFetch.map(function (id) {
            return getEntity(state, pluralKey, id);
        });
    }

    return ids.map(function (id) {
        return getEntity(state, key, id);
    }).filter(function (entity) {
        return !!entity;
    });
};

/**
 * Grab the ID from JSON API response containing a single Entity
 *
 * @param  {Object} jsonData
 * @return {String}
 */
var getId = exports.getId = function getId(jsonData) {
    return jsonData.data.id;
};

/**
 * Grab the ID's from a JSON API response containing an array of Entities
 *
 * @param  {Object} jsonData
 * @return {Array}
 */
var getIds = exports.getIds = function getIds(jsonData) {
    return jsonData.data.map(function (entity) {
        return entity.id;
    });
};

/**
 * Grab an Entity group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @return {Mixed}
 */
var getEntitiesMeta = exports.getEntitiesMeta = function getEntitiesMeta(state, entityKey) {
    var metaKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return metaKey === null ? state.getIn([entityKey, 'meta']) && state.getIn([entityKey, 'meta']).toJS() : state.getIn([entityKey, 'meta', metaKey]);
};

/**
 * Grab an Entity's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @return {Mixed}
 */
var getEntityMeta = exports.getEntityMeta = function getEntityMeta(state, entityKey, entityId) {
    var metaKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    return metaKey === null ? state.getIn([entityKey, 'byId', entityId, 'meta']) && state.getIn([entityKey, 'byId', entityId, 'meta']).toJS() : state.getIn([entityKey, 'byId', entityId, 'meta', metaKey]);
};

/**
 * Generate a valid Entity with the given attributes
 *
 * @param  {String} entityKey
 * @param  {Object} attributes
 * @return {Object}
 */
var generateEntity = exports.generateEntity = function generateEntity(entityKey, attributes) {
    var id = attributes.id || _uuid2.default.v4();

    return {
        type: entityKey,
        id: id,
        attributes: Object.keys(attributes).filter(function (key) {
            return key !== 'id';
        }).reduce(function (carrier, key) {
            return _extends({}, carrier, _defineProperty({}, key, attributes[key]));
        }, {})
    };
};