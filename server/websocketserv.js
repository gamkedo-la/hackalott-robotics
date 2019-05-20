
import WebSocket from 'ws';
import gameloop from './gameloop.js';

var ws_server; // Our WebSocket server, set only after start_server() have been called.

function start_server(http_server) {
    console.log("Starting WebSocket server...");

    ws_server = new WebSocket.Server({ 
        server: http_server, 
        clientTracking: true 
    });
 
    ws_server.on('connection', start_login_protocol); 

    console.log("Starting WebSocket server - DONE");
};

function start_login_protocol(wsocket){
    wsocket.on('message',(message)=>{
        console.log("Received message: " + message);
        if(!message.startsWith("login:")){
            wsocket.terminate();
            console.log("Wrong login, connection refused: " + message.data);
            return;
        }

        let player_login = message.slice("login:".length);
        console.log("New client : '" + player_login + "'");
        gameloop.add_client(wsocket, player_login);
    });
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