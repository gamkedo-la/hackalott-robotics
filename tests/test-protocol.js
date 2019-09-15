import assert, { throws } from "assert";
import * as proto from "../core/protocol.js";
import http from 'http';
import WebSocket from 'ws';

const test_port = 8989;
const test_hostname = "localhost";

async function dummy_server(){
    
    let http_server = await new Promise((resolve)=>{
        let http_server = http.createServer(()=>{});
        http_server.listen(test_port, test_hostname);
        http_server.on("listening", ()=>{
            resolve(http_server);
        });
    });
    
    let ws_server = new WebSocket.Server({ 
            server:http_server, 
            clientTracking: true 
        });

    ws_server.on("connection", (client)=>{
        console.log("Test server: received connection");
        client.on("message", (data)=>{ // just ping back
            client.send(JSON.stringify({
                msg: "response",
                data: data 
            }), (err)=>{ 
                console.log("Test server: now closing");
                client.close();
                console.log("Test server: closing done"); 
            });
        });
    });

    ws_server.on("close", ()=>{ 
        // Close the http server when we are requested to close the
        // websocket server.
        http_server.close();
    });
       
    return ws_server;
};

function dummy_websocket() {
    try{
        let socket = new WebSocket(`ws://${test_hostname}:${test_port}`);
        return socket;
    }
    catch(err){
        console.error(`Failed to create test websocket: ${err}`);
        return null;
    }
}

const tests = {
    messages_are_well_formed : function() {
        let message = proto.make_message("test", "success");
        assert(proto.is_valid_message(message));
    },

    empty_message_is_invalid : function() {
        assert(!proto.is_valid_message({}));
    },

    message_dispatcher_dispatches_messages : function(){
        let count_received_success = 0;
        let count_received_failure = 0;
        
        let dispatcher = new proto.MessageDispatcher();
        dispatcher.set_handler("test", {
            "success" : ()=>{ ++count_received_success; },
            "failure" : ()=>{ ++count_received_failure; }
        });
        dispatcher.set_handler("inexistant", {
            "success" : ()=>{ assert.fail("Received message it should not have received."); },
            "failure" : ()=>{ assert.fail("Received message it should not have received."); }
        });

        dispatcher.dispatch([]);
        assert.equal(count_received_success, 0);
        assert.equal(count_received_failure, 0);

        dispatcher.dispatch([proto.make_message("none", "none")]);
        assert.equal(count_received_success, 0);
        assert.equal(count_received_failure, 0);

        dispatcher.dispatch([proto.make_message("test", "none")]);
        assert.equal(count_received_success, 0);
        assert.equal(count_received_failure, 0);

        dispatcher.dispatch([proto.make_message("test", "success")]);
        assert.equal(count_received_success, 1);
        assert.equal(count_received_failure, 0);

        dispatcher.dispatch([proto.make_message("test", "failure")]);
        assert.equal(count_received_success, 1);
        assert.equal(count_received_failure, 1);

        dispatcher.dispatch([
            proto.make_message("test", "failure"),
            proto.make_message("test", "success")
        ]);
        assert.equal(count_received_success, 2);
        assert.equal(count_received_failure, 2);
    },
    empty_object_is_not_valid_socket : function(){
        var socket = {};
        assert.equal(proto.is_socket(socket), false);
        socket = { send: function(){} };
        assert.equal(proto.is_socket(socket), false);
    },
    websocket_is_valid_socket : async function(){
        let server = await dummy_server();
        let socket = dummy_websocket();
        assert.equal(proto.is_socket(socket), true);
        // Send a message and receive it back.
        const message_value = "kikoo";
        socket.on("open", ()=>{
            socket.send(message_value);
        });
        socket.on("message", (message)=>{
            message = JSON.parse(message);
            console.log("Received message: ", message);
            assert.equal(message.data, message_value);
            server.close();
            console.log("done with socket");
        });
        console.log("kikoo");
    },
    // local_socket_is_valid_socket : function(){
    //     let socket = new proto.LocalSocket();
    //     assert.equal(proto.is_socket(socket), true);
    // }
};



async function run_all_tests(){
    console.log("Running core protocol tests:");
    // console.log(Object.entries(tests));
    for(let [test_name, test_func] of Object.entries(tests)){
        console.log(`Test: ${test_name}`);
        if(test_func){
            // try {                
                await test_func();   
            // } catch (error) {
            //     if(error instanceof  assert.AssertionError){
            //         console.error(`FAILURE in ${test_name} : ${error}`);
            //     }
            //     else throw error;
            // }
        }
        else
            console.error("No test function.");
    }
}

run_all_tests();



