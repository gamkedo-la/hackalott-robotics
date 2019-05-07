
var access_counter = 0;
var cycle = 0;

var increment_access_counter = function(){
  ++access_counter;
};


const http = require('http');

const hostname = '127.0.0.1'; 
const port = 3000;

const server = http.createServer((req, res) => {
  if(req.method=="GET" && req.url=="/")
  {
    increment_access_counter();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("This is klaim\'s multiplayer js game prototype, yay! Access = " + access_counter 
      + ", cycle = " + cycle + "\/n");
  }  else   {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("Wrong url/n");
  }  
});

server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

var update = function(){
  ++cycle;

};

setInterval(update, 100); // Run the game update


// var WebSocketServer = require('websocket').server;
// // create the server
// wsServer = new WebSocketServer({
//   httpServer: server
// });

// // WebSocket server
// wsServer.on('request', function(request) {
//   var connection = request.accept(null, request.origin);

//   // This is the most important callback for us, we'll handle
//   // all messages from users here.
//   connection.on('message', function(message) {
//     if (message.type === 'utf8') {
//       // process WebSocket message
//       message.end("cycle count = " + cycle);
//     }
//   });

//   connection.on('close', function(connection) {
//     // close user connection
//   });
// });