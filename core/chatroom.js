

export function ChatLog(login, message){
    return {
                login : login,
                message : message
            };    
};

const max_history_size = 100;

export const ChatRoom = function(){
    
    this.message_history = []; // ChatLog objects in history order
    this.listeners = [];

    this.notify_all = function(chat_log){
        for(let listener of this.listeners){
            listener(chat_log);
        }
    };


    this.add_listener= function(listener){
        console.assert(listener);
        this.listeners.push(listener);
    };

    this.remove_listener= function(listener_to_remove){
        this.listeners = this.listeners.filter((listener)=>{
            return listener == listener_to_remove;
        });
    };
    
    this.add_log = function(chat_log){
        console.log("ChatRoom: " + chat_log.login + "> " + chat_log.message);
        this.message_history.push(chat_log);
        
        while(this.message_history.size > max_history_size) {
            this.message_history.shift();
        }

        this.notify_all(chat_log);
    };

    this.capture_message_history = function(){
        return this.message_history.slice();
    };

}



