
import {World} from "./world.js";


const update_cycle_tick_ms = 100;

let next_player_id = 0;

/* Represent one player connected to the game.
*/
export const Player = function(name) {
    this.id = next_player_id++;
    this.name = name;
    this.commands = [];
    this.event_listeners;

    this.acquire_last_commands = function(){
        // Once acquired, the commands should not be used anymore so we just return them.
        // But be ready to add new incoming commands.
        let commands_so_far = this.commands;
        this.commands = [];
        return commands_so_far;
    }

    this.push_command = function(message){
        this.commands.push(message);
    }

    this

    this.receive_event = function(event){

    }
};

/* The Game type represent the whole game state and update it.
    It updates the game state after gathering messages every tick.
    Messages have a specific format:
        ...
*/
export const Game = function() {
    this.update_cycle = 0;
    this.update_timer_id = null;
    this.players = [];
    this.event_listeners = [];
    
    // Setup the world!
    this.World = new World();

    this.start = function(){
        console.log("Starting game update loop... (" + update_cycle_tick_ms + "ms lockstep)");
        this.update_timer_id = setInterval(this.update_one_cycle, update_cycle_tick_ms);
        console.log("Starting game update loop - DONE");
    };

    this.stop = function(){
        console.log("Stopping game update loop...");
        clearInterval(this.update_timer_id);
        console.log("Stopping game update loop - DONE");
    }

    this.add_player = function(player){
        console.assert(player);
        this.players.push(player);
        this.players.sort((left, right)=>{ return left.id < right.id; })
        
        // TODO: Add here all events related to new players
        
        console.log(`New player '${player.name}' entered the game`);
        return true;
    };

    this.remove_player = function(player_id){
        var idx = 0;
        for(let player of this.players){
            if(player.id == player_id){
                let player = this.players.splice(idx, 1);
                console.log(`Player '${player.name}' left the game`);
                return player;
            }
            ++idx;
        }
        return undefined;
    }

    this.add_event_listener = function(listener){
        console.assert(listener);
        event_listeners.push(listener);
    }

    this.remove_event_listener = function(listener){
        for(let idx = 0; idx < this.event_listeners.length; ++idx) {
            if(this.event_listeners[idx] == listener){
                return this.event_listeners.splice(idx,1);
            }
        }
    }

    this.broadcast_events = function(events){
        throw "NOT IMPLEMENTED YET";
    }
    

    this.update_one_cycle = function(){
        ++this.update_cycle;


    };

};


