const lodash = require('lodash');

const getUniqueId = async (model) => { 
    let notUnique = true;
    let code;
    while(notUnique){
        code = lodash.random(1000000,9999999).toString();
        const doc = await model.findOne({code});
        if(!doc){
            notUnique= false;
        }
    }
    return code;
}

module.exports = {
    getUniqueId
};