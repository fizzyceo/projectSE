const FDI_THRESHOLDS = {
    200:{
        type: "low",
        danger:false,
    },
    400:{
        type: "moderate",
        danger:false,
    },
    800:{
        type:"high",
        danger:true,
    },
    1000:{
        type:"very high",
        danger:true,
    },
    1600:{
        type:"extreme",
        danger:true,
    },
    2500:{
        type:"catastrophic",
        danger:true,
    },
}

module.exports= {FDI_THRESHOLDS}