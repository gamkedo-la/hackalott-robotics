import assert, { throws } from "assert";
import * as proto from "../core/protocol.js";

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
    }
};



function run_all_tests(){
    console.log("Running core protocol tests:");
    // console.log(Object.entries(tests));
    for(let [test_name, test_func] of Object.entries(tests)){
        console.log(`Test: ${test_name}`);
        if(test_func){
            // try {                
                test_func();   
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
