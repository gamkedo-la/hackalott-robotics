import {Game, Player} from "../core/game.js";

var current_game = undefined;

function start() {
    current_game = new Game();
    current_game.start();
};

function stop() {
    current_game.stop();
    current_game = null;
};

function add_client(client_socket, player_login){

    let player = new Player(player_login);
    // TODO: listen the socket for commands to push them in the player object
    
    // forward events from the game world to the player
    current_game.add_event_listener((events)=>{
        if(events.length > 0) {
            client_socket.send(JSON.stringify(events));
        }
    });

    return current_game.add_player(player);
}


function update_cycle() { return current_game.update_cycle; }

export default { start, stop, update_cycle, add_client };