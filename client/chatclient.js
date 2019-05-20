import {ChatLog} from "../core/chatroom.js";

export const ChatClient = function(html_display, text_input, send_button){
    this.login = "me";
    this.text_display = html_display;
    this.text_input = text_input;
    this.send_button = send_button;

    this.text_display.value = "Chat Client Ready!";

    let add_log = (chat_log)=>{
        // TODO: add sanitization of message
        this.text_display.value += `\n${chat_log.login}> ${chat_log.message}`;
    };

    let on_chat_history = (chat_history)=>{
        for(let chat_log of chat_history){
            add_log(chat_log);
        }
    };
    
    this.on_message = (message) =>{
        if(message.data.type=="chat-log"){
            add_log(message.data.chat_log);
        }
        else if (message.data.type=="chat-log"){
            on_chat_history(message.data.message_history);
        }        
    };

    let send_message = (wsocket)=>{
        this.text_input.value.trim();
        if(this.text_input.value.length >= 0) {
            wsocket.send( new ChatLog(this.login, this.text_input.value) );
            this.text_input.value = "";
        }
    };

    this.start_online = function(wsocket, login){
        this.login = login;
        wsocket.addEventListener("message", this.on_message);
        wsocket.addEventListener("close", ()=>{ add_log(new ChatLog("!!!!", "Connection closed.")); });
        this.send_button.onclick = ()=>{ send_message(wsocket); };
    };
};


