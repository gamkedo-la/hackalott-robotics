const {Game} = require("../core/game");

var current_game = undefined;
const start_update_loop = ()=> {
    current_game = new Game();
    current_game.start();
};


// List here all things that needs to be usable by users of this module.
module.exports.update_cycle = ()=>{ return current_game.update_cycle; };
module.exports.start = start_update_loop;
