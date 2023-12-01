const User = require("../models/user");

const getReceivers = async (to,receivers) => {
    switch (to) {
        case "all":
            receivers= await User.find({
                highestRole: {
                    $in: ["customer", "advertiser"]
                }
            },{
                _id: 1
            })
            break;
        case "customers":
            receivers= await User.find({
                highestRole: "customer"
            },{
                _id: 1
            })
            break;
        case "advertisers":
            receivers= await User.find({
                highestRole: "advertiser"
            },{
                _id: 1
            })
            break;
    
        default:
            receivers = receivers.map((item)=>{
                return {
                    _id: item
                }
            })
            break;
    }
    
    return receivers;
}

module.exports = getReceivers;