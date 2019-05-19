
// This is the main server file that should be run by NodeJS.

const print_arguments = () =>
{
  console.log("Server started with args : ");

  process.argv.forEach((arg, idx) =>{
    console.log("ARG[" + idx + "] : " + arg);
  });

  console.log("Working Directory: " + process.cwd());
  
};
print_arguments();

var access_counter = 0;

var increment_access_counter = function(){
  ++access_counter;
};

const processPortFromArgs = () => {
  var port = process.argv[2]; // We assume that the argument after the source file is the port to use.
  if(!port) {
    throw "Specify port as 2nd argument!";
  }
  
  if(!parseInt(port)) {
    throw "Port argument must be a port number! This is not valid: " + port;
  }

  return port;
}

const gameloop = require('./gameloop');
gameloop.start(); // Start the game even if there is no connections yet.

const http = require('http');
const ws_server = require("./websocketserv");
const admin = require('./admin');
const html = require('./html_utils');

const hostname = '127.0.0.1';       // TODO: make this an optional CLI parametter
const port = processPortFromArgs();

const http_server = http.createServer((req, res) => {
  if(req.method=="GET")
  {

  }
  if(req.url=="/")
  {
    increment_access_counter();
    html.serve("index.html", res, {
      "access_counter" : access_counter,
      "cycle" : gameloop.update_cycle(),
      "client_count" : ws_server.count_clients(),
      "server_code" : "document.getElementById('online_info').style.display='block';\n"
          + `field.set_default_url(window.location.hostname);`
    });
  }
  else if(req.url=="/admin")
  {
    html.serve("admin.html", res);
  }
  else if(req.url=="/restart") {
    html.serve("restarting.html", res).then(admin.update_and_restart);
  }
  else if(req.url=="/quick-restart") {
    html.serve("restarting.html", res).then(admin.restart);
  }
  else if(req.url=="/stop") {
    html.serve("stopped.html", res).then(admin.stop);
  }
  // We allow accessing all client files.
  else if(req.url.startsWith("/client/") || req.url.startsWith("/core/"))
  {
    html.serve(req.url, res);
  }
  // Request not understood or file not found:
  else {
    html.serve_file_not_found(req.url, res);
  }  
});

http_server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

ws_server.start_server(http_server);
