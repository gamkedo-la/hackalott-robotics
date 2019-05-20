import gameserver from './gameserver.js';
import http from 'http';
import ws_server from "./websocketserv.js";
import admin from './admin.js';
import html from './html_utils.js';

var access_counter = 0;


function print_arguments() {
  console.log("Server started with args : ");

  process.argv.forEach((arg, idx) =>{
    console.log("ARG[" + idx + "] : " + arg);
  });

  console.log("Working Directory: " + process.cwd());
  
};


function increment_access_counter() {
  ++access_counter;
};

function processPortFromArgs() {
  var port = process.argv[2]; // We assume that the argument after the source file is the port to use.
  if(!port) {
    throw "Specify port as 2nd argument!";
  }
  
  if(!parseInt(port)) {
    throw "Port argument must be a port number! This is not valid: " + port;
  }

  return port;
};

function http_server_receive(req, res) {
  if(req.method=="GET")
  {
    if(req.url=="/")
    {
      increment_access_counter();
      html.serve("index.html", res, {
        "access_counter" : access_counter,
        "cycle" : gameserver.update_cycle(),
        "client_count" : ws_server.count_clients(),
        "server_code" : "client.on_served_by_game_server();"
      });
    }
    else if(req.url=="/admin")
    {
      html.serve("server/admin.html", res);
    }
    else if(req.url=="/restart") {
      html.serve("server/restarting.html", res).then(admin.update_and_restart);
    }
    else if(req.url=="/quick-restart") {
      html.serve("server/restarting.html", res).then(admin.restart);
    }
    else if(req.url=="/stop") {
      html.serve("server/stopped.html", res).then(admin.stop);
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
  }
  else {
    html.serve_file_not_found(req.url, res);
  }
}

////////////////////////////////////////////////
//// MAIN EXECUTION STARTS HERE

print_arguments();

gameserver.start(); // Start the game even if there is no connections yet.

const hostname = "127.0.0.1";       // TODO: make this an optional CLI parametter
const port = processPortFromArgs();

const http_server = http.createServer(http_server_receive);

http_server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}`);
});

ws_server.start_server(http_server);
