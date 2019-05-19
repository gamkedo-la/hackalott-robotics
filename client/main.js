
var default_server_hostname = "prototypenodejs.klaimsden.net"; // Used if the client is run in a local browser.

let field = {
    server_hostname : document.getElementById('server_hostname'),

    reset_server_hostname : ()=>{ server_hostname.value = default_server_hostname; },
    set_default_server : (new_default_url)=>{ default_server_hostname = new_default_url; }

};

field.reset_server_hostname();

let client = {
    websocket: undefined, // Until conenct_to_server() is called.
    connect_to_server: (server_url)=>{
        let ws_url = `wss://${server_url}`;
        console.log(`Connecting to ${ws_url} through WebSocket...`);
        websocket = new WebSocket(ws_url);

    }

};



