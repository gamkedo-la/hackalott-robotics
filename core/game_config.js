// This file contains all the constants of the game that should be known by all the game implementation (rules/state, client & server).
const update_cycle_tick_ms = 100;



// This is for NodeJS only!
if(module) { // Need to expose API available to the server's code.
    module.exports.update_cycle_tick_ms = update_cycle_tick_ms;
}
