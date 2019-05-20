import {Game} from "../core/game.js";

var default_server_hostname = "https://prototypenodejs.klaimsden.net"; // Used if the client is run in a local browser.

var websocket = undefined; // Until conenct_to_server() is called.
let ui = new MainPageUI();

function MainPageUI(){

    let server_hostname = document.getElementById('server_hostname');
    let connection_panel = document.getElementById('connection_panel');
    let button_server_reset = document.getElementById('button_server_reset');
    let button_play_online = document.getElementById('button_play_online');
    let button_play_offline = document.getElementById('button_play_offline');
    let connection_status_panel = document.getElementById('connection_status_panel');
    let player_login = document.getElementById('player_login');
    let game_panel = document.getElementById('game_panel');
    let online_info_display = document.getElementById('online_info');
    let online_info_box = document.getElementById('online_info_box');
    let online_info_box_opener = document.getElementById('online_info_box_opener');
    let button_open_online_info_box = document.getElementById('button_open_online_info_box');
    let button_close_online_info_box = document.getElementById('button_close_online_info_box');

    this.reset_server_hostname = function(){ server_hostname.value = default_server_hostname; };
    this.set_default_server = function(new_default_url) { default_server_hostname = new_default_url; };
    
    this.log_connection_status = function (message) {
        console.log(message);
        connection_status_panel.innerHTML += "<div>" + message + "</div>";
    };

    this.show_connection_status = function (message = "") {
        if(message.length != 0) {
            this.log_connection_status(message);
        }
        connection_status_panel.style.display = "block";
    };

    this.hide_connection_status = function () {
        connection_status_panel.style.display = "none";
    };
    
    this.open_info_box = function () {
        online_info_box.style.display = "block";
        online_info_box_opener.style.display = "none";
    };

    this.close_info_box = function () {
        online_info_box.style.display = "none";
        online_info_box_opener.style.display = "block";
    };

    this.show_online_info = function () {
        online_info_display.style.display = "block";
    };
       
    this.show_connection_panel = function () {
        connection_panel.style.display = "block";
    };

    this.hide_connection_panel = function () {
        connection_panel.style.display = "none";
    };

    this.show_game_client = function () {
        game_panel.style.display = "block";
    };

    this.hide_game_client = function () {
        game_panel.style.display = "none";
        game_panel.innerText = "";
    };

    this.player_login = function(){
        return player_login.value;
    };

    this.sanitize_player_login = function(){        
        player_login.value.trim();
        player_login.value = player_login.value.replace(/\s/g, "_");
    };

    //////////////////////////////////////////////////////
    // Initialization:
    button_play_online.onclick = ()=>{ 
        connect_to_server(server_hostname.value); 
    };

    button_server_reset.onclick = ()=>{
        this.reset_server_hostname();
    };

    button_open_online_info_box.onclick = ()=>{
        this.open_info_box();
    };

    button_close_online_info_box.onclick = ()=>{
        this.close_info_box();
    };

    this.reset_server_hostname();

};


function from_http_to_websocket(url) {
    var ws_url = url.replace("http://", "ws://");
    ws_url = ws_url.replace("https://", "wss://");
    return ws_url;
};



function connect_to_server(server_url) {
    let ws_url = from_http_to_websocket(server_url);

    if(!ws_url.startsWith("ws")) {
        throw "Server url must have a valid protocol (http, https, ws, wss), for example: " 
            + default_server_hostname + " or " + from_http_to_websocket(default_server_hostname);
    }

    ui.sanitize_player_login();    
    if(ui.player_login().length < 4){
        ui.log_connection_status("Invalid login!");
        return;
    }

    ui.hide_connection_panel();
    ui.show_connection_status(`Connecting to ${ws_url} through WebSocket...`);

    websocket = new WebSocket(ws_url);
    websocket.addEventListener("error", on_received_error);
    websocket.addEventListener("message", on_received_message);
    websocket.addEventListener("open", on_connection_open);
    websocket.addEventListener("close", on_connection_closed);
};

function on_received_error (error){
    let log = "Server Error: " + error;
    console.error(log);
    ui.show_connection_status(log);
    stop_game_client();
};

function on_received_message(message) {
    if(message.data.startsWith("login?")) {
        websocket.send("login:" + ui.player_login());
        return;
    }
    console.log("Received message: " + message.data);
    // TODO: pass the message to the game handler
};

function on_connection_open(event) {
    ui.show_connection_status("Connection to server: OK");
    start_game_client();
};

function on_connection_closed(event) {
    ui.show_connection_status("Connection to server: CLOSED");
    stop_game_client();
}

function on_served_by_game_server() {
    ui.set_default_server(window.location.href);
    ui.reset_server_hostname();
    ui.show_online_info();
}

function start_game_client(){
    // TODO: Load the game client display here
    ui.show_game_client();
}

function stop_game_client(){
    ui.hide_game_client();
    // TODO: ...
}

export default { connect_to_server, ui, on_served_by_game_server };