import * as chatroom from "../core/chatroom.js";

export const ChatClient = function(html_display, text_input, send_button){
    this.login = "me";
    this.text_display = html_display;
    this.text_input = text_input;
    this.send_button = send_button;

    this.text_display.value = "Chat Client Ready!";

    let add_log = (chat_log)=>{
        // TODO: add sanitization of message
        console.log("adding log " + `${chat_log.login}: ${chat_log.message}`);
        var log_display = document.createElement("div");
        log_display.innerHTML = `${chat_log.login}: ${chat_log.message}`;
        this.text_display.appendChild(log_display);
    };

    let on_chat_history = (chat_history)=>{
        for(let chat_log of chat_history){
            add_log(chat_log);
        }
    };
    
    this.on_message = (message) =>{
        console.log("Message for chat client: " + JSON.stringify(message) );
        if(message.type==chatroom.MESSAGE_TYPE_CHATLOG){
            console.log("Chat log" );
            add_log(message.chat_log);
        }
        else if (message.type==chatroom.MESSAGE_TYPE_CHAT_HISTORY){
            console.log("Chat history" );
            on_chat_history(message.message_history);
        }        
    };

    let send_message = (wsocket)=>{
        this.text_input.value.trim();
        if(this.text_input.value.length >= 0) {
            wsocket.send([{ 
                msgtype: "chat-log",
                chat_log: new chatroom.ChatLog(this.login, this.text_input.value) 
            }]);
            this.text_input.value = "";
        }
    };

    this.start_online = function(wsocket, login){
        this.login = login;
        wsocket.addEventListener("message", this.on_message);
        wsocket.addEventListener("close", ()=>{ add_log(new chatroom.ChatLog("!!!!", "Connection closed.")); });
        this.send_button.onclick = ()=>{ send_message(wsocket); };

        wsocket.send(new chatroom.Command_RequestChatHistory());
    };
};


