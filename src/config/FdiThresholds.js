const FDI_THRESHOLDS = {
    400:{
        type: "low",
        danger:false,
    },
    750:{
        type: "moderate",
        danger:false,
    },
    850:{
        type:"high",
        danger:true,
    },
    900:{
        type:"very high",
        danger:true,
    },
    1000:{
        type:"extreme",
        danger:true,
    },
    1300:{
        type:"catastrophic",
        danger:true,
    },
}

module.exports= {FDI_THRESHOLDS}