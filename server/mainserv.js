
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


const http = require('http');

const hostname = '127.0.0.1'; 
const port = 3000;

const server = http.createServer((req, res) => {
  if(req.method=="GET" && req.url=="/")
  {
    increment_access_counter();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<html><body><div><div>YES IT WORKS WHOOHOOOO</div>This is klaim\'s multiplayer js game prototype, yay! Access = " + access_counter 
      + ", cycle = " + cycle + "</div>"
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

const {spawn, exec} = require('child_process');

const source_dir = process.cwd(); // We assume that node's working directory is the source code directory

const update_sources_to_master = (on_done) => {
  console.log("Updating sources to last version of current branch...");
  var once_ready = (stdout) => {
    console.log(stdout);
        on_done();
  };
  const options = { cwd : source_dir };
  exec("git pull -r", options, (error, stdout, stderr) => {
    if (error) {
      console.log("Source code update failed! -> " + error
        + "\nAttempting to abort source update...");
      exec("git rebase --abort", options, (error, stdout, stderr) => {
        if(error)
        {
          console.log("Abort failed! -> " + error);
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
