
var default_server_url = "prototypenodejs.klaimsden.net";

let field = {
    server_url : document.getElementById('server_url'),    

    reset_server_url : ()=>{ server_url.value = default_server_url; },
    set_default_url : (new_default_url)=>{ default_server_url = new_default_url; }

};

field.reset_server_url();

let client = {
    websocket: undefined, // Until conenct_to_server() is called.
    connect_to_server: (server_url)=>{
        let ws_url = `ws://${server_url}`;
        console.log(`Connecting to ${ws_url} through WebSocket...`);
        websocket = new WebSocket(ws_url);

    }

};



