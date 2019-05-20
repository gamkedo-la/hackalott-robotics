import {Game} from "../core/game.js";

var current_game = undefined;

function start() {
    current_game = new Game();
    current_game.start();
};

function stop() {
    current_game.stop();
    current_game = null;
};

function update_cycle() { return current_game.update_cycle; }

export default { start, stop, update_cycle };