import {Game, Player} from "../core/game.js";
import {ChatServer} from "./chatserver.js";

var current_game = undefined;
let listeners = [];
let clients = [];

const Client = function(wsocket, player_login){
    this.player = new Player(player_login);
    this.wsocket = wsocket;
};

function start() {
    current_game = new Game();
    current_game.start();
};

function stop() {
    current_game.stop();
    current_game = null;
};

function add_client(client_socket, player_login){

    let new_client = new Client(client_socket, player_login);
    clients.push(new_client);

    // TODO: listen the socket for commands to push them in the player object
    client_socket.onmessage = (message)=> {
        // TODO: check message format and extract the command if it is a command
        // TOOD: handle other kinds of messages too        
        new_client.player.push_command(message);
    };

    client_socket.onclose = ()=>{ remove_client(new_client); };
    
    // forward events from the game world to the player
    current_game.add_event_listener((events)=>{
        if(events.length > 0) {
            client_socket.send(JSON.stringify(events));
        }
    });
    
    let result= current_game.add_player(new_client.player);
    on_client_added(new_client);
    return result;
}

function remove_client(client_to_remove){
    var client_was_removed = false;
    clients = clients.filter(function(client, index, arr){
        return client == client_to_remove;
    });
    if(client_was_removed) {
        on_client_removed(client_to_remove);
    }
}

function on_client_added(client){
    for(let listener of listeners){
        listener.on_client_added(client);
    }
}

function on_client_removed(client){
    for(let listener of listeners){
        listener.on_client_removed(client);
    }
}

function add_listener(listener){
    console.assert(listener);
    listeners.push(listener);
}

function update_cycle() { return current_game.update_cycle; }

export default { Client, start, stop, update_cycle, add_client, remove_client, add_listener };