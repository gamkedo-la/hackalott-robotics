import assert from "./utility/assert.js";
import { EventEmitter } from "events";

// Returns a well-formed message object with the provided data.
export function make_message(protocol_name, message_type, data = undefined){
    // TODO: add some arguments types and values checks here
    assert(protocol_name, "Protocol name field must be valid");
    assert(message_type, "Message type field must be valid");

    let message = {
        msg_id : undefined,
        proto : protocol_name,
        msg_type : message_type,
        data : data,
    };
    return message;
}

export function is_valid_message(message){
    if(!message)
        return false;

    if(!message.proto
    || !message.msg_type
    )
        return false;

    // TODO: add checks here
    return true;
}

// Dispatches messages to handlers depending on their protocols and types.
export class MessageDispatcher
{
    handler_map = new Map();
    
    set_handler(protocol_name, handler){
        // TODO: add asserts
        assert(protocol_name);
        assert(handler);
        this.handler_map.set(protocol_name, handler);
    }

    dispatch(message_sequence){
        assert(message_sequence instanceof Array);
        // console.log(message_sequence);
        for(let message of message_sequence){
            
            if(!is_valid_message(message))
            {
                console.error(`INVALID MESSAGE ON DISPATCH: ${JSON.stringify(message)}`);
                continue;
            }

            let handler = this.handler_map.get(message.proto);
            if(handler && handler[message.msg_type]){
                handler[message.msg_type](message.data);
            }
        }
    }

};

// Returns true if the object have the interface of a socket
// that we need to be able to work with it.
export function is_socket(socket){
    if(!socket)
        return false;
    
    if(!socket.send || !socket.send)
        return false;

    if(!(socket instanceof EventEmitter))
        return false;

    return true;
}

// Returns true if the object have the interface of a socket
// and if it's open.
export function is_open_socket(socket){
    if(!socket)
        return false;

    // TODO: how to check if the socket is open????
    
    return true;
}

// Handle a socket to work with the protocol
// The socket can be non-remote, as long as it's
// an object with the right interface it's ok.
// It can be a websocket too, so we can handle all situations here.
export class Connection {
    socket = null;
    dispatcher = new MessageDispatcher();
    next_message_id = 0;
    messages_to_send = [];
    messages_received = [];

    // Store and handle the socket.
    // The socket must be open.
    constructor(socket){
        assert(is_open_socket(socket));
        
        this.socket = socket;    
        this.socket.on("open", this.__on_open);
        this.socket.on("close", this.__on_close);
        this.socket.on("message", this.__on_message);
        this.socket.on("message", this.__on_error);
    }

    // Register a message to be sent on next `submit()` call.
    // Also set a new message id to the message.
    push(message){
        assert(is_valid_message(message));

        let new_message_id = this.__new_message_id();
        message.msg_id = new_message_id;

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

    __on_open(/* ??? */){

    }

    __on_close(/* ??? */){
        
    }

    __on_message(/* ??? */){
        
    }

    __on_error(/* ??? */){
        
    }
};

// Socket that works locally (not remote).
// It requires the receive() function to be called regularly to dispatch
// messages to listeners of the "message" dispatch.
export class LocalSocket extends EventEmitter
{
    is_open = true;
    messages_queue = [];

    constructor(){
        super();
        this.emit("open");
    }

    // Send an arbitrary message object that will be received when receive() is called.
    send(message){
        this.__throw_if_closed();
        assert(message);
        this.messages_queue.push(message);
    }
    
    // Close this socket: make it unusable.
    close(){
        // TODO: ????
        this.is_open = false;
    }

    // Dispatch each messages to the "message" handlers.
    receive(){
        // console.log("receive!");
        this.__throw_if_closed();
        let messages = this.messages_queue;
        this.messages_queue = [];
        messages.forEach(message => {
            // console.log(`message received: ${message}`);
            this.emit("message", message);
        });
    }

    // Adds a handler for the associated event name.
    on(eventName, listener)
    {
        if(eventName == "open" && this.is_open)
            listener();
        else if(eventName == "close" && !this.is_open)
            listener();
        else
            super.on(eventName, listener);
    }

    // Used to throw errors if this socket is closed and we try to use it.
    __throw_if_closed(){  
        if(this.is_open === false){
            throw "failure: attempt to use a closed LocalSocket"
        }
    }
};

