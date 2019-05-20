
import WebSocket from 'ws';

var ws_server; // Our WebSocket server, set only after start_server() have been called.

function start_server(http_server) {
    console.log("Starting WebSocket server...");

    ws_server = new WebSocket.Server({ 
        server: http_server, 
        clientTracking: true 
    });
 
    ws_server.on('connection', function connection(ws) {
        console.log(`New client: ${ws.url}` );
        ws.on('message', function incoming(message) {
            console.log(`received: ${message}`);
        });
        
        ws.send('something');
    });

    console.log("Starting WebSocket server - DONE");
};

function count_clients() { 
    if(ws_server) {
        return ws_server.clients.size;
    } else {
        return 0;
    }
};


export default { start_server, count_clients };