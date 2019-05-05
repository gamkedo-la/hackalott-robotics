
var access_counter = 0;
var cycle = 0;

var increment_access_counter = function(){
  ++access_counter;
};

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  increment_access_counter();
  res.end("This is klaim\'s multiplayer js game prototype, yay! Access = " + access_counter 
    + ", cycle = " + cycle + "\/n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

var update = function(){
  ++cycle;

};

setInterval(update, 100); // Run the game update


