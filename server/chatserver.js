import {ChatRoom, ChatLog} from "../core/chatroom.js";
import game_server from "./gameserver.js";

export function ChatServer(game_server){
    this.chatroom = new ChatRoom();
    this.listener_registry = new Map(); // TODO: repplace this by something more elegant...

    game_server.add_listener({
        on_client_added : (client)=>{
            this.chatroom.add_log(new ChatLog("!note!", `'${client.player.name}' entered the chatroom.`));
            
            var message_history = this.chatroom.capture_message_history();
            client.wsocket.send([{ msgtype:"chat-history", message_history: message_history}]);
            
            let listener = (chat_log)=>{
                client.wsocket.send([{ msgtype:"chat-log", chat_log: chat_log}]);
            };
            this.listener_registry.set(client, listener);
            this.chatroom.add_listener(listener);
        },
        on_client_removed : (client)=>{            
            let listener = this.listener_registry.get(client);
            this.chatroom.remove_listener(listener);
            this.chatroom.add_log(new ChatLog("!note!", `'${client.player.name}' left the chatroom.`));
        }
    });

}
