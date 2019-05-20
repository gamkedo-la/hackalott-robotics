const update_cycle_tick_ms = 100;

/* The Game type represent the whole game state and update it.
    It updates the game state after gathering messages every tick.
    Messages have a specific format:
        ...
*/
const Game = function() {
    this.update_cycle = 0;

    this.update_one_cycle = ()=>{
        ++this.update_cycle;
    };

    this.start = ()=>{
        console.log("Starting game update loop.");
        setInterval(this.update_one_cycle, update_cycle_tick_ms);
    };
};

if(module){ // Export for NodeJS
    module.exports.Game = Game;
}

