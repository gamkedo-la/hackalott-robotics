import http from 'http';
 
let test_port = 8989;
let test_hostname = "localhost";
 
console.log("Start...");
 
let http_server = http.createServer((req, res)=>{
    res.end();
});
http_server.listen(test_port, test_hostname);
 
console.log("Ready.");
 
console.log("Shutdown...");
 
http_server.on('listening', () =>{
    http_server.close((err)=>{
      console.log("HTTP server closed.");
    });
  });

console.log("Shutdown - DONE");