Game Core Protocol
==================

This file describes and implements parts of the core protocol
that will be used in the whole game.

That protocol is not necessarilly designed to be secure or efficient.
It's designed to be simple to make some games with.

That protocol is also designed to work independently of the transport,
so it should work fine without a 

A) Core Protocol:
-----------------

0. The protocol starts once a connection is established between a client and a server.
1. If any of the following conditions are not met, the connection is immediately closed.
2. All messages going through the connection must have the format specified in section B.
3. Once the connection is established, the sub-protocol "core.auth" is engaged until 
   success (everything is fine) or failure (shutdown the connection). Only this protocol
   can be used.
4. Once authentication is done, other sub-protocols are activated. All the sub-protocols
   are notified that they are now active (HOW?)
5. When a message is received, it is sent to the handler for it's sub-protocol (see section B).
   If a protocol is not 
6. The connection does not need to be remote. (to allo seamless solo games)

B) Message Format:
------------------

1. Messages are objects serializable to JSON.
2. Each message must contain the following members:
    2.1. `msg_id`: A message identifier, automatically set when sent. 
    2.2. `proto` : A protocol identifier, used to dispatch the message to the right handler.
    2.3. `msg_type` : An identifier of the kind of message, defined by the protocol.
3. `data`: Optionally, messages can contain arbitrary additional data in this field.
4. Messages are sent and received in an array of messages. This allow making sending messages
   and update loops to be independant (if wanted).

Examples:
```

let message_1 = {                              
            "msg_id": null,             // The message id is set automatically.               
            "proto" : "chatroom",       // Sub-protocol name.
            "msg_type": "new-user",     // Message type from this sub-protocol.
            "some_data": { /*...*/ }    // Data related to the message type.
        };

let message_2 = {                               // Another message...
            "msg_id": null,             // The message id is determined automatically.               
            "proto" : "chatroom",       // Sub-protocol name.
            "msg_type": "log",          // Message type from this sub-protocol.
            // Data related to the message type.
            "text": "It's a meeee! Marrriooo!", 
            "author": "Mario"           
        };

some_socket.send({  // Core protocol message
    [ // Sequence of messages (when batching by cycle)
        message_1,
        message_2
    ]
});


```

5. There must be one protocol handler per pair of protocol and connection.
    Protocol handlers must be registered by the program.
6. 


C) Authentication Protocol:
---------------------------

Once a connection is established between a client and a server,
authentication will always go as follow:

1. Client send to server the following message:
 TODO
2. Server receives the message from the client. 
    If either of these condition is met, send a "protocol-error" message and disconnect (and log): 
    - game name does not matches the current game name
    - game version does not match the current game version
    - ???
3. Server send to client the authentication success message:
TODO
4. Server-side connection-specific protocol handlers are activated.
    Server send a "ready" message.
    Server can start sending and receving protocol-specific messages.
5. Client-side connection-specific protocol handlers are activated.
    Client can start sending and receving protocol-specific messages.
