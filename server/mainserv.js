
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
var cycle = 0;

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


const http = require('http');

const hostname = '127.0.0.1'; 
const port = processPortFromArgs();

const server = http.createServer((req, res) => {
  if(req.method=="GET" && req.url=="/")
  {
    increment_access_counter();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<html><body><div>This is klaim\'s multiplayer js game prototype, yay! Access = " + access_counter 
      + ", cycle = " + cycle + "</div>"
      + "</body></html>"
      , "utf8");
  }
  else if(req.method=="GET" && req.url=="/admin")
  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<html><body><div>ADMIN ACCESS</div>"
      + "<button onclick=\"window.location.href='/restart'\" >UPDATE & RESTART</button>"
      + "</body></html>"
      , "utf8");
  }
  else if(req.method=="GET" && req.url=="/restart") {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<html>\n"
      + "<script>\n"
      + "  //Using setTimeout to execute a function after seconds.\n"
      + "  setTimeout(function(){\n"
      + "     //Redirect with JavaScript\n"
      + "     window.location.href= '/';\n"
      + "  }, 3000);\n"
      + "</script>\n" 
      + "<body><div>RESTARTING NOW, PLEASE WAIT...</div></body>\n"
      + "</html>"
      , "utf8", update_and_restart);
  }
  else   {
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

const update_cycle_tick_ms = 100;

setInterval(update, update_cycle_tick_ms); // Run the game update

const {spawn, exec} = require('child_process');

const source_dir = process.cwd(); // We assume that node's working directory is the source code directory

const update_sources_to_master = (on_done) => {
  console.log("Updating sources to last version of current branch...");
  var once_ready = (stdout) => {
    console.log(stdout);
        on_done();
  };
  const options = { cwd : source_dir };
  execFile("git pull -r", options, (error, stdout, stderr) => {
    if (error) {
      console.error("Source code update failed! -> " + error
        + "\nAttempting to abort source update...");
      execFile("git rebase --abort", options, (error, stdout, stderr) => {
        if(error)
        {
          console.error("Abort failed! -> " + error);
        }
        once_ready(stdout);
      });
    }
    else
    {
      once_ready(stdout);
    }    
  });
};

const restart = () => {
  console.log("Rebooting...");
  spawn(process.execPath, process.argv.slice(1), {
    detached: true
  }).unref();
  process.exit();
};

const update_and_restart = () => {
  update_sources_to_master(restart);
};

var WebSocketServer = require('websocket').server;

var wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function clientIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
  if (!clientIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from client ' + request.origin + ' rejected.');
    return;
  }
  
  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log('Received Message: ' + message.utf8Data);
          connection.sendUTF(message.utf8Data);
      }
      else if (message.type === 'binary') {
          console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
          connection.sendBytes(message.binaryData);
      }
  });
  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});