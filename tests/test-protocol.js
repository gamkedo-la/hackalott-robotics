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
};



function run_all_tests(){
    console.log("Running core protocol tests:");
    // console.log(Object.entries(tests));
    for(let [test_name, test_func] of Object.entries(tests)){
        console.log(`Test: ${test_name}`);
        if(test_func){
            try {                
                test_func();   
            } catch (error) {
                if(error instanceof  assert.AssertionError){
                    console.error(`FAILURE in ${test_name} : ${error}`);
                }
                else throw error;
            }
        }
        else
            console.error("No test function.");
    }
}

run_all_tests();
