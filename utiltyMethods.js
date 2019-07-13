
/**********************************************************************
 * This function ensures a returned variable is never undefined or null
 **********************************************************************/
function validify(variable){
    if (variable == null || variable == undefined){
        return [];
    }
    return variable;
}

function validifyInt(variable){
    if (variable == null || variable == undefined){
        return 0;
    }
    return variable;
}

module.exports = {
    validify: validify,
    validifyInt: validifyInt
};