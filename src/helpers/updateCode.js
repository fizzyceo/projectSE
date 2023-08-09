const lodash = require('lodash');
const { getUniqueId } = require('./getUniqueId')


const updateCode = async (model) => { 
    let doc = await model.findOne({
        code: {$exists: false}
    });
    while(doc){
        const randomCode = await getUniqueId(model);
        await doc.update({
            $set: {
                code: randomCode
            }
        })
        doc = await model.findOne({
            code: {$exists: false}
        });
    }
}

module.exports = {
    updateCode
};