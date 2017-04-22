'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clearEntityType = exports.removeEntity = exports.updateEntityMeta = exports.updateEntitiesMeta = exports.updateEntity = exports.removeRelationshipFromEntity = exports.addRelationshipToEntity = exports.insertOrUpdateEntities = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param  {Object} state
 * @param  {Object} payload
 * @return {Object}
 */
var insertOrUpdateEntities = exports.insertOrUpdateEntities = function insertOrUpdateEntities(state, payload) {
    var data = payload.data || [payload];
    var entities = Array.isArray(data) ? data : [data];
    var included = payload.included || [];

    entities = entities.concat(included);

    return entities.reduce(insertOrUpdateEntity, state);
};

/**
 * Insert a single Entity into the state
 *
 * @param  {Object} state
 * @param  {Object} entity
 * @return {Object}
 */
var insertOrUpdateEntity = function insertOrUpdateEntity(state, entity) {
    validateEntity(entity);

    var pluralKey = (0, _pluralize2.default)(entity.type);

    return state.mergeIn([pluralKey, 'byId', entity.id, 'data'], transformEntity(entity));
};

/**
 * Ensure that an Entity is well-formed
 *
 * @param  {Object} entity
 */
var validateEntity = function validateEntity(entity) {
    if (!('type' in entity)) {
        throw new Error('JSON API resource objects must have a `type` property');
    }

    if (!('id' in entity)) {
        throw new Error('JSON API resource objects must have an `id` property');
    }
};

/**
 * Get an Entity's attributes
 * and normalize its relationships
 *
 * @param  {Object} entity
 * @return {Object}
 */
var transformEntity = function transformEntity(entity) {
    var transformedEntity = (0, _immutable.Map)(entity.attributes);

    return entity.relationships ? transformedEntity.merge(transformRelationships(entity.relationships)) : transformedEntity;
};

/**
 * Normalize an Entity's relationships
 *
 * @param  {Object} relationships
 * @return {Array|String}
 */
var transformRelationships = function transformRelationships(relationships) {
    var result = Object.keys(relationships).reduce(function (transformedRelationships, key) {
        return Array.isArray(relationships[key].data) ? _extends({}, transformedRelationships, _defineProperty({}, (0, _pluralize2.default)(key), (0, _immutable.Set)(relationships[key].data.map(function (relationship) {
            return relationship.id;

        })))) : _extends({}, transformedRelationships, _defineProperty({}, key, relationships[key].data ? relationships[key].data.id : null));
    }, {});

    return result;
};

/**
 * Insert an Entity into the state and
 * add it as a relationship to another Entity
 *
 * @param  {Object}         initialState
 * @param  {String}         entityKey
 * @param  {String}         entityId
 * @param  {String}         relationshipKey
 * @param  {Object|String}  relationshipObject  Can be either a valid JSON API object or a string ID
 * @return {Object}
 */
var addRelationshipToEntity = exports.addRelationshipToEntity = function addRelationshipToEntity(initialState, entityKey, entityId, relationshipKey, relationshipObject) {
    var pluralEntityKey = (0, _pluralize2.default)(entityKey);

    var wrappedRelationshipObject = !relationshipObject.data ? { data: relationshipObject } : relationshipObject;

    if (Array.isArray(wrappedRelationshipObject.data)) {
        return wrappedRelationshipObject.data.reduce(function (carrier, singleItem) {
            return addRelationshipToEntity(carrier, pluralEntityKey, entityId, relationshipKey, singleItem);
        }, initialState);
    }

    if (typeof wrappedRelationshipObject.data === 'string') {
        return initialState.updateIn([pluralEntityKey, 'byId', entityId, 'data', relationshipKey], (0, _immutable.Set)(), function (arr) {
            return arr.add(wrappedRelationshipObject.data);
        });
    }

    var newState = insertOrUpdateEntities(initialState, wrappedRelationshipObject);

    return newState.updateIn([pluralEntityKey, 'byId', entityId, 'data', relationshipKey], (0, _immutable.Set)(), function (arr) {
        return arr.add(wrappedRelationshipObject.data.id);
    });
};

/**
 * Remove a relationship an Entity
 *
 * @param  {Object} initialState
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Object}
 */
var removeRelationshipFromEntity = exports.removeRelationshipFromEntity = function removeRelationshipFromEntity(initialState, entityKey, entityId, relationshipKey, relationshipId) {
    var pluralEntityKey = (0, _pluralize2.default)(entityKey);

    return initialState.updateIn([pluralEntityKey, 'byId', entityId, 'data', relationshipKey], function (arr) {
        return arr.remove(relationshipId);
    });
};

/**
 * Update an Entity's attributes
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
var updateEntity = exports.updateEntity = function updateEntity(state, entityKey, entityId, data) {
    return insertOrUpdateEntities(state, {
        data: {
            type: entityKey,
            id: entityId,
            attributes: data
        }
    });
};

/**
 * Update the meta data for an Entity group
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
var updateEntitiesMeta = exports.updateEntitiesMeta = function updateEntitiesMeta(state, entityKey, metaKey, value) {
    var pluralKey = (0, _pluralize2.default)(entityKey);
    return metaKey ? state.setIn([pluralKey, 'meta', metaKey], value) : state.setIn([pluralKey, 'meta'], (0, _immutable.Map)(value));
};

/**
 * Update the meta data for an Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
var updateEntityMeta = exports.updateEntityMeta = function updateEntityMeta(state, entityKey, entityId, metaKey, value) {
    var pluralKey = (0, _pluralize2.default)(entityKey);
    return metaKey ? state.setIn([pluralKey, 'byId', entityId, 'meta', metaKey], value) : state.setIn([pluralKey, 'byId', entityId, 'meta'], (0, _immutable.Map)(value));
};

/**
 * Remove a single Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
var removeEntity = exports.removeEntity = function removeEntity(state, entityKey, entityId) {
    var pluralKey = (0, _pluralize2.default)(entityKey);
    return state.deleteIn([pluralKey, 'byId', entityId]);
};

/**
 * Clear all of the Entities out of an Entity type
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @return {Object}
 */
var clearEntityType = exports.clearEntityType = function clearEntityType(state, entityKey) {
    var pluralKey = (0, _pluralize2.default)(entityKey);
    return state.delete(pluralKey);
};
