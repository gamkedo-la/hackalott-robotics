
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
    if(!message || length(message) == 0)
        return false;
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

// Returns true if the object have the interface of a socket
// and if it's open.
export function is_open_connection(socket){
    // TODO: implement this!!!
    return true;
}

// Handle a socket to work with the protocol
// The socket can be non-remote, as long as it's
// an object with the right interface it's ok.
// It can be a websocket.
export class Connection {
    // Store and handle the socket.
    // The socket must be open.
    constructor(socket){
        if(!is_open_connection(socket)){
            // TODOL: log and throw an error! 
        }
        
        this.socket = socket;
        this.dispatcher = new MessageDispatcher();
        this.next_message_id = 0;
        this.messages_to_send = [];
        this.messages_received = [];

        this.socket.addEventHandler("onreceive", () =>{

        });
    }

    is_open() { return this.socket && this.socket.is_connected(); }

    // Register a message to be sent on next `submit()` call.
    // Also set a new message id to the message.
    push(message){
        if(!is_valid_message(message)){
            // TODO: log and throw an error!
        }
        let new_message_id = this.__new_message_id();
        message[MESSAGE_FIELD_ID] = new_message_id;

        this.messages_to_send.push(message);
    }

    // Sends all the messages accumulated through `push()` calls.
    submit(){
        let messages = this.messages_to_send;
        this.messages_to_send = [];
        this.socket.send(messages);
    }

    // Dispatch all messages received since last call to this function.
    receive_messages() {
        let messages = this.messages_received;
        this.messages_received = [];
        this.dispatcher.dispatch(messages);
    }

    set_protocol_handler(handler){
        this.dispatcher.set_handler(handler);
    }

    // Generate the next 
    __new_message_id() { return this.next_message_id++; }
};

export class LocalSocket
{

};

