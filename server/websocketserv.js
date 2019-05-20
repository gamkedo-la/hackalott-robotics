
import WebSocket from 'ws';
import gameserver from './gameserver.js';
import {ChatServer} from './chatserver.js';

var ws_server; // Our WebSocket server, set only after start_server() have been called.
var chat_server;

function start_server(http_server) {
    console.log("Starting WebSocket server...");

    ws_server = new WebSocket.Server({ 
        server: http_server, 
        clientTracking: true 
    });
 
    ws_server.on('connection', start_login_protocol); 

    console.log("Starting WebSocket server - DONE");

    chat_server = new ChatServer(gameserver);
};

function start_login_protocol(wsocket){
    wsocket.onmessage = (complete_message)=>{
        let message = complete_message.data;

        console.log("Received message: " + message);
        if(!message.startsWith("login:")){
            wsocket.terminate();
            console.log("Wrong login, connection refused: " + message);
            return;
        }

        let player_login = message.slice("login:".length);
        
        // this one should be replaces by the rest of the code.
        wsocket.onmessage = (complete_message)=>{ 
            let message = complete_message.data;
            console.log("Received unprocessed message: " + message); 
        };

        console.log("New client : '" + player_login + "'");
        gameserver.add_client(wsocket, player_login);
    };
    wsocket.send("login?");
}


function count_clients() { 
    if(ws_server) {
        return ws_server.clients.size;
    } else {
        return 0;
    }
};


export default { start_server, count_clients };