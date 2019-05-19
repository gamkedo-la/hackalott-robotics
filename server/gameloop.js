


const update_cycle_tick_ms = 100;
let update_cycle = 0;

const update = () => {
    ++update_cycle;
    // TODO: execute the game update code here.
};

const start_update_loop = ()=> {
    console.log("Starting game update loop.");
    setInterval(update, update_cycle_tick_ms);
};


// List here all things that needs to be usable by users of this module.
module.exports.update_cycle = ()=>{ return update_cycle; };
module.exports.start = start_update_loop;
