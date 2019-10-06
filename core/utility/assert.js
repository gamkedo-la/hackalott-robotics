
function assert_check(check_value, message) {
    if(!(check_value ===undefined) 
    && (!check_value || check_value === null) ){
        if(message){
            throw `Assertion failed! : ${message}`;
        }
        else {
            throw `Assertion failed!`;
        }

    }
}

export default assert_check;

