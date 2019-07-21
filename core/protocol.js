
const MESSAGE_FIELD_ID = "msg_id";
const MESSAGE_FIELD_PROTOCOL = "proto";
const MESSAGE_FIELD_TYPE = "msg_type";
const MESSAGE_FIELD_DATA = "data";

// Returns a well-formed message object with the provided data.
export function make_message(protocol_name, message_type, data){
    // TODO: add some arguments types and values checks here
    return {
        MESSAGE_FIELD_ID : undefined,
        MESSAGE_FIELD_PROTOCOL : protocol_name,
        MESSAGE_FIELD_TYPE: message_type,
        MESSAGE_FIELD_DATA: data
    };
}

export function is_valid_message(message){
    // TODO: add checks here
    return true;
}

// Dispatches messages to handlers depending on their protocols and types.
export class MessageDispatcher
{
    MessageDispatcher(){
        this.handler_map = new Map();
    }

    set_handler(protocol_name, handler){
        // TODO: add asserts
        this.handler_map[protocol_name] = handler;
    }

    dispatch(message_sequence){
        for(let message in message_sequence){
            if(!is_valid_message(message))
            {
                // TODO: log error here
                continue;
            }

            let handler = this.handler_map.get(message[MESSAGE_FIELD_PROTOCOL]);
            if(handler){
                let data = message[MESSAGE_FIELD_DATA];
                if(data){
                    handler[message[MESSAGE_FIELD_TYPE]](data)
                } else {
                    handler[message[MESSAGE_FIELD_TYPE]]();
                }
            }
        }
    }

};

// Returns true if the object have the interface of a connection
// and if it's open.
export function is_open_connection(connection){
    // TODO: implement this!!!
    return true;
}

// Handle a connection to work with the protocol
// The connection can be non-remote, as long as it's
// an object with the right interface it's ok.
// It can be a websocket.
export class Endpoint {
    // Store and handle the connection.
    // The connection must be open.
    constructor(connection){
        if(!is_open_connection(connection)){
            // TODOL: log and throw an error! 
        }
        
        this.connection = connection;
        this.dispatcher = new MessageDispatcher();
        this.next_message_id = 0;

        this.connection.addHandler("onreceive", __on_messages_received);
    }

    // TO CONSIDER: push(message) push(message) submit()
    send(messages){
        for(let message in messages){
            if(!is_valid_message(message)){
                // TODO: log and throw an error!
            }
    
            let new_message_id = this.next_message_id++;
            message[MESSAGE_FIELD_ID] = new_message_id;
    
        }
        
        this.connection.send([message]); // ? how to batch
    }

    __on_messages_received(messages){
        this.dispatcher.dispatch(messages);
    }
    
    __on_messages_received(messages){

    }
    
    __on_connection_open(messages){

    }
    
    __on_connection_closed(messages){

    }

}

