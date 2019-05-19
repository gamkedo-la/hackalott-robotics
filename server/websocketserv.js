
const WebSocket = require('ws');

var ws_server; // Our WebSocket server, set only after start_server() have been called.

const start_server = (http_server) => {
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

const count_clients = ()=>{ 
    if(ws_server) {
        return ws_server.clients.size;
    } else {
        return 0;
    }
};

module.exports.start_server = start_server;
module.exports.count_clients = count_clients;