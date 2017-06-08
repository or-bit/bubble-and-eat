/**
 * Chef actions module
 * @module order-gateway/chefActions
 * @see module:monolith-backend/Action
 * @see module:order-gateway/chefStates
 */

const chefStates = require('../states/chefStates').chefStates;
const Action = require('monolith-backend').Action;

/**
 * Returns an Action instance to use in redux dispatch.
 * @param readyDate - Date indicating when chef is ready.
 */
exports.present = readyDate => Action.create(chefStates.present, readyDate);

/**
 * Returns an Action instance to use in redux dispatch.
 * @param leavingDate - Date indicating when chef is leaving.
 */
exports.absent = leavingDate => Action.create(chefStates.absent, leavingDate);
