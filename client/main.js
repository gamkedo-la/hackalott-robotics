
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

let client = {
    websocket: undefined, // Until conenct_to_server() is called.
    connect_to_server: (server_url)=>{
        let ws_url = from_http_to_websocket(server_url);

        if(!ws_url.startsWith("ws"))
        {
            throw "Server url must have a valid protocol (http, https, ws, wss), for example: " 
                + default_server_hostname + " or " + from_http_to_websocket(default_server_hostname);
        }

        console.log(`Connecting to ${ws_url} through WebSocket...`);
        websocket = new WebSocket(ws_url);
    }

};



