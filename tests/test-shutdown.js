import http from 'http';
import http_shutdown from 'http-shutdown';

let test_port = 8989;
let test_hostname = "localhost";

console.log("Start...");

let http_server = http_shutdown(http.createServer((req, res)=>{
    res.end();
}));
http_server.listen(test_port, test_hostname);

console.log("Ready.");

console.log("Shutdown...");

http_server.shutdown((err)=>{
    console.log("HTTP server down.");
});

console.log("Shutdown - DONE");


