
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
const fs = require('fs');

const hostname = '127.0.0.1';       // TODO: make this an optional CLI parametter
const port = processPortFromArgs();


// Replace all "{{value_name}}" in the html text by `template_values["value_name"]` - in case it's a template
const process_html_template = (html_content, template_values) => {
  let processed_content = html_content;    // We don't want to change the original.
  for (const [key, value] of Object.entries(template_values)) {
    processed_content = processed_content.replace(`{{${key}}}`, value);
  };
  return processed_content;
}

// Serve an processed html (template) file path relative to this file's directory.
const serve_html = (file_path, response, template_values = {} ) => {
      var path = `${__dirname}/${file_path}`;
      console.log(`Serving ${path}`);
      return fs.promises.readFile(path, { encoding: 'utf8'})
        .then((contents) => {        
          // console.log(`Processing ${path} ...`);
          let processed_content = process_html_template(contents, template_values);

          // console.log(`Sending processed ${path} ...`);
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.end(processed_content);
          console.log(`Sending processed ${path} - Done`);
        
        }, (error)=>{
          response.end(`SERVER ERROR: ${error}`);
        });
};

const server = http.createServer((req, res) => {
  if(req.method=="GET" && req.url=="/")
  {
    increment_access_counter();
    serve_html("../index.html", res, {
      "access_counter" : access_counter,
      "cycle" : cycle
    });
  }
  else if(req.method=="GET" && req.url=="/admin")
  {
    serve_html("admin.html", res);
  }
  else if(req.method=="GET" && req.url=="/restart") {
    serve_html("restarting.html", res).then(update_and_restart);
  }
  else if(req.method=="GET" && req.url=="/stop") {
    serve_html("stopped.html", res).then(stop);
  }
  else   {
    // TODO: replace this by an html file.
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
const update_commands_context = { cwd : source_dir };

const update_sources_to_master = (on_done) => {
  console.log("Updating sources to last version of current branch...");
  var once_ready = (stdout) => {
    console.log(stdout);
        on_done();
  };
  
  exec("git pull -r", update_commands_context, (error, stdout, stderr) => {
    if (error) {
      console.error("Source code update failed! -> " + error
        + "\nAttempting to abort source update...");
      exec("git rebase --abort", update_commands_context, (error, stdout, stderr) => {
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

const update_dependencies = (on_done) => {
  return ()=> {
    exec("npm ci", update_commands_context, (error, stdout, stderr) => {
      if (error) {
        // TODO: do something here? throw exception? fail everything?
        throw error;
      }
      console.log(stdout);
      on_done();
    });  
  };
  
};

const restart = () => {
  console.log("Rebooting...");
  spawn(process.execPath, process.argv.slice(1), {
    detached: true
  }).unref();
  process.exit();
};
const stop = () => {
  console.log("Stopping...");
  process.exit();
};

const update_and_restart = () => {
  update_sources_to_master(update_dependencies(restart));
};

// var WebSocketServer = require('websocket').server;

// var wsServer = new WebSocketServer({
//   httpServer: server,
//   // You should not use autoAcceptConnections for production
//   // applications, as it defeats all standard cross-origin protection
//   // facilities built into the protocol and the browser.  You should
//   // *always* verify the connection's origin and decide whether or not
//   // to accept it.
//   autoAcceptConnections: false
// });

// function clientIsAllowed(origin) {
//   // put logic here to detect whether the specified origin is allowed.
//   return true;
// }

// wsServer.on('request', function(request) {
//   if (!clientIsAllowed(request.origin)) {
//     // Make sure we only accept requests from an allowed origin
//     request.reject();
//     console.log((new Date()) + ' Connection from client ' + request.origin + ' rejected.');
//     return;
//   }
  
//   var connection = request.accept('game-protocol', request.origin);
//   console.log((new Date()) + ' Connection accepted.');
//   connection.on('message', function(message) {
//       if (message.type === 'utf8') {
//           console.log('Received Message: ' + message.utf8Data);
//           connection.sendUTF(message.utf8Data);
//       }
//       else if (message.type === 'binary') {
//           console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
//           connection.sendBytes(message.binaryData);
//       }
//   });
//   connection.on('close', function(reasonCode, description) {
//       console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//   });
// });