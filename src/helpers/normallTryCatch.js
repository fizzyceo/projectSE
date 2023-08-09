
const nextError = require('./errorTypeFunction')
const tryCatch = (fn) => { 
    try {
        return fn();
    } catch (error) {
        nextError(error);
    }
}


module.exports = tryCatch
