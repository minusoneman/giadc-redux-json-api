'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearEntityType = exports.removeEntity = exports.updateEntityMeta = exports.updateEntitiesMeta = exports.updateEntity = exports.removeRelationshipFromEntity = exports.addRelationshipToEntity = exports.loadJsonApiEntityData = undefined;

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _actionNames = require('./action-names');

var _actionNames2 = _interopRequireDefault(_actionNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
var loadJsonApiEntityData = exports.loadJsonApiEntityData = function loadJsonApiEntityData(data) {
  return {
    type: _actionNames2.default.LOAD_JSON_API_ENTITY_DATA,
    data: data
  };
};

/**
 * Add a relationship to an Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {Object} relationshipObject
 * @return {Object}
 */
var addRelationshipToEntity = exports.addRelationshipToEntity = function addRelationshipToEntity(entityKey, entityId, relationshipKey, relationshipObject) {
  return {
    type: _actionNames2.default.ADD_RELATIONSHIP_TO_ENTITY + '_' + (0, _pluralize2.default)(entityKey, 1).toUpperCase() + '_' + (0, _pluralize2.default)(relationshipKey).toUpperCase(),
    entityKey: entityKey,
    entityId: entityId,
    relationshipKey: relationshipKey,
    relationshipObject: relationshipObject
  };
};

/**
 * Remove a relationship from an Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Object}
 */
var removeRelationshipFromEntity = exports.removeRelationshipFromEntity = function removeRelationshipFromEntity(entityKey, entityId, relationshipKey, relationshipId) {
  return {
    type: _actionNames2.default.REMOVE_RELATIONSHIP_FROM_ENTITY + '_' + (0, _pluralize2.default)(entityKey, 1).toUpperCase() + '_' + (0, _pluralize2.default)(relationshipKey).toUpperCase(),
    entityKey: entityKey,
    entityId: entityId,
    relationshipKey: relationshipKey,
    relationshipId: relationshipId
  };
};

/**
 * Update an Entity's attributes
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
var updateEntity = exports.updateEntity = function updateEntity(entityKey, entityId, data) {
  return {
    type: _actionNames2.default.UPDATE_ENTITY + '_' + (0, _pluralize2.default)(entityKey, 1).toUpperCase(),
    entityKey: entityKey,
    entityId: entityId,
    data: data
  };
};

/**
 * Update an Entity group's meta data
 *
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
var updateEntitiesMeta = exports.updateEntitiesMeta = function updateEntitiesMeta(entityKey, metaKey, value) {
  return {
    type: _actionNames2.default.UPDATE_ENTITIES_META + '_' + (0, _pluralize2.default)(entityKey).toUpperCase(),
    entityKey: entityKey,
    metaKey: metaKey,
    value: value
  };
};

/**
 * Update an Entity's meta data
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
var updateEntityMeta = exports.updateEntityMeta = function updateEntityMeta(entityKey, entityId, metaKey, value) {
  return {
    type: _actionNames2.default.UPDATE_ENTITY_META + '_' + (0, _pluralize2.default)(entityKey, 1).toUpperCase(),
    entityKey: entityKey,
    entityId: entityId,
    metaKey: metaKey,
    value: value
  };
};

/**
 * Remove a single Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
var removeEntity = exports.removeEntity = function removeEntity(entityKey, entityId) {
  return {
    type: _actionNames2.default.REMOVE_ENTITY + '_' + (0, _pluralize2.default)(entityKey, 1).toUpperCase(),
    entityKey: entityKey,
    entityId: entityId
  };
};

/**
 * Clear all the Entities from an Entity type
 *
 * @param  {String} entityKey
 * @return {Object}
 */
var clearEntityType = exports.clearEntityType = function clearEntityType(entityKey) {
  return {
    type: _actionNames2.default.CLEAR_ENTITY_TYPE + '_' + (0, _pluralize2.default)(entityKey).toUpperCase(),
    entityKey: entityKey
  };
};