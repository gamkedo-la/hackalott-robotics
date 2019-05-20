
import {World} from "./world.js";


const update_cycle_tick_ms = 100;

let next_player_id = 0;

/* Represent one player connected to the game.
*/
export function Player(name) {
    this.id = next_player_id++;
    this.name = name;
    this.commands = [];

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

    this.receive_events = function(events){
        for(let listener of this.event_listeners){
            try{
                listener(events);
            }catch(error) {
                console.error("Player listener error: " + error);
            }
        }
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
    this.world = new World();

    this.start = function(){
        console.log("Starting game update loop... (" + update_cycle_tick_ms + "ms lockstep)");
        this.update_timer_id = setInterval(this.update_one_cycle, update_cycle_tick_ms);
        console.log("Starting game update loop - DONE");
    };

    this.stop = function(){
        console.log("Stopping game update loop...");
        clearInterval(this.update_timer_id);
        console.log("Stopping game update loop - DONE");
    };

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
    };

    this.add_event_listener = function(listener){
        console.assert(listener);
        this.event_listeners.push(listener);
    };

    this.remove_event_listener = function(listener){
        for(let idx = 0; idx < this.event_listeners.length; ++idx) {
            if(this.event_listeners[idx] == listener){
                return this.event_listeners.splice(idx,1);
            }
        }
    };

    this.publish_events = function(events){
        for(let observer of this.event_listeners){
            try{
                observer(events);
            }catch(error){
                console.log("Game listener failed: " + error);
            }
        }
    };

    
    this.process_players_commands = function(){
        // TODO: add players commands processing here
    };


    this.update_one_cycle = ()=>{
        ++this.update_cycle;
        this.process_players_commands();
        this.world.update();
        let events = this.world.last_events;
        this.publish_events(events);
            
    };


};


