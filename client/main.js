
var default_server_hostname = "https://prototypenodejs.klaimsden.net"; // Used if the client is run in a local browser.

let field = {
    server_hostname : document.getElementById('server_hostname'),

    reset_server_hostname : ()=>{ server_hostname.value = default_server_hostname; },
    set_default_server : (new_default_url)=>{ default_server_hostname = new_default_url; }

};

field.reset_server_hostname();

const from_http_to_websocket = (url)=>{
    var ws_url = url.replace("http://", "ws://");
    ws_url = ws_url.replace("https://", "wss://");
    return ws_url;
};


var websocket = undefined; // Until conenct_to_server() is called.

const connect_to_server = (server_url)=>{
    let ws_url = from_http_to_websocket(server_url);

    if(!ws_url.startsWith("ws"))
    {
        throw "Server url must have a valid protocol (http, https, ws, wss), for example: " 
            + default_server_hostname + " or " + from_http_to_websocket(default_server_hostname);
    }

    console.log(`Connecting to ${ws_url} through WebSocket...`);
    websocket = new WebSocket(ws_url);

    websocket.onerror = on_received_error;
    websocket.onmessage = on_received_message;
    websocket.onopen = on_connection_open;
    websocket.onclose = on_connection_closed;
};

const on_received_error = (error) => {
    console.error("Connection to server ERROR: " + error);
};

const on_received_message = (message) => {
    console.log("Received message: " + message);
};

const on_connection_open = (event) => {
    console.log("Connection to server: OK");
};

const on_connection_closed = (event) => {
    console.log("Connection to server: CLOSED");
}




