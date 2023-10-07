 function max(a,b){
    if(!a){
        return b
    }
    if(!b){
        return a
    }
    if(a>b){
        return a 
    }else{
        return b 
    }
}

module.exports = {max}