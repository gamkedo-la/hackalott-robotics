
var default_server_hostname = "https://prototypenodejs.klaimsden.net"; // Used if the client is run in a local browser.

let field = {
    server_hostname : document.getElementById('server_hostname'),
    connection_panel : document.getElementById('connection_panel'),
    server_hostname : document.getElementById('server_hostname'),
    button_server_reset : document.getElementById('button_server_reset'),
    button_play_online : document.getElementById('button_play_online'),
    button_play_offline : document.getElementById('button_play_offline'),
    connection_status_panel: document.getElementById('connection_status_panel'),
    game_panel : document.getElementById('game_panel'),
    online_info_box : document.getElementById('online_info_box'),
    online_info_box_opener : document.getElementById('online_info_box_opener'),

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

    hide_connection_panel();
    show_connection_status(`Connecting to ${ws_url} through WebSocket...`);

    websocket = new WebSocket(ws_url);
    websocket.addEventListener("error", on_received_error);
    websocket.addEventListener("message", on_received_message);
    websocket.addEventListener("open", on_connection_open);
    websocket.addEventListener("close", on_connection_closed);
};

const on_received_error = (error) => {
    let log = "Server Error: " + error;
    console.error(log);
    show_connection_status(log);
    stop_game_client();
};

const on_received_message = (message) => {
    console.log("Received message: " + message.data);
    // TODO: pass the message to the game handler
};

const on_connection_open = (event) => {
    show_connection_status("Connection to server: OK");
    start_game_client();
    setTimeout(hide_connection_status, 2000); // Hide the connection status a bit later.
};

const on_connection_closed = (event) => {
    show_connection_status("Connection to server: CLOSED");
    stop_game_client();
}

const log_connection_status = (message) => {
    console.log(message);
    field.connection_status_panel.innerHTML += "<div>" + message + "</div>";
}

const show_connection_status = (message = "") => {
    if(message.length != 0) {
        log_connection_status(message);
    }
    field.connection_status_panel.style.display = "block";
}
const hide_connection_status = () => {
    field.connection_status_panel.style.display = "none";
}

const show_connection_panel = () => {
    connection_panel.style.display = "block";
}

const hide_connection_panel = () => {
    connection_panel.style.display = "none";
}

const start_game_client = () => {
    game_panel.style.display = "block";
    // TODO: inject game client display here and start update here.
}

const stop_game_client = () => {
    game_panel.style.display = "none";
    game_panel.innerText = "";
}

const open_info_box = () => {
    field.online_info_box.style.display = "block";
    field.online_info_box_opener.style.display = "none";
}

const close_info_box = () => {
    field.online_info_box.style.display = "none";
    field.online_info_box_opener.style.display = "block";
}