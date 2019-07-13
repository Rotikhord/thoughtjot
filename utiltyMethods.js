
/**********************************************************************
 * This function ensures a returned variable is never undefined or null
 **********************************************************************/
function validify(variable){
    if (variable == null || variable == undefined){
        return [];
    }
    return variable;
}

module.exports = {
    validify: validify
};