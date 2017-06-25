/**
 * Chef actions module
 * @module chefActions
 * @see module:Action
 * @see module:chefStates
 */

const chefStates = require('../states/chefStates').chefStates;
const Action = require('monolith-backend').Action;

/**
 * Returns an Action instance to use in redux dispatch.
 * @function present
 * @param readyDate {Date} Date indicating when the chef is ready.
 */
exports.present = readyDate => Action.create(chefStates.present, readyDate);

/**
 * Returns an Action instance to use in redux dispatch.
 * @function absent
 * @param leavingDate {Date} Date indicating when the chef is leaving.
 */
exports.absent = leavingDate => Action.create(chefStates.absent, leavingDate);
