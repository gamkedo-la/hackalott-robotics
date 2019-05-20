
export const EVENT = {
    SOMETHING_HAPPENED : { event:"SOMETHING_HAPPENED" },
};
    


/* Represents the complete state and rules of the game.
*/
export function World() {
    this.last_events = [];
    this.update_cycle_start_time = Date.now();
    this.last_ping_time = this.update_cycle_start_time;

    this.update = function(){
        this.update_cycle_start_time = Date.now();
        this.clear_last_events();
        
        // TODO: update the world state using rules here.

        // THIS IS TEMPORARY:
        if(this.update_cycle_start_time >= this.last_ping_time + 2000)
        {
            this.last_ping_time = this.update_cycle_start_time;

            this.publish_event(EVENT.SOMETHING_HAPPENED);
        }
    };

    this.now = function(){ return this.update_cycle_start_time; }

    this.clear_last_events = function(){
        this.last_events = [];
    };

    this.publish_event = function(event){
        console.assert(event);
        this.last_events.push(event);
    }

};

