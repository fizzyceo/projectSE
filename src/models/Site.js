const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require('../helpers/getUniqueId');
const moment = require('moment');
const ApiError = require("../error/api-error");

const SiteSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },

        
        name:{
            type:String,
            unique:true,
            required:true,
        },
        location: {
            type: pointSchema,
        },
        wilaya: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        isDeleted:{
            type: Boolean,
            default:false
        }
    },
    { timestamps: true },
);


SiteSchema.statics.createSite = async function (body) {
    console.log("*/////////////////////**");
    const exists = await this.findOne({ name: body.name })
    console.log(exists);
    if (exists)
        throw ApiError.badRequest('Site already exist')
    if (body.location) {
        body.location = {
            type: 'Point',
            coordinates: body.location
        }
    }
    body.code = await getUniqueId(this);
    
    const site = new this(body)
    await site.save();
    return site;
}

SiteSchema.statics.getSites = async function (){
    try {
    
        const limit = 10;
    
        const sites = await this.find({} )
          .limit(limit);
    
        return sites;
      } catch (error) {
        console.error(error);
        throw error;
      }
}

SiteSchema.statics.getOne = async function (id) {
    const site = await this.findOne({
        _id: id
    })
    if (!site)
        throw ApiError.notFound('Device not found')
    return site;
}
SiteSchema.statics.getSitesCount = async function (id) {
    try {
        const query = {
            isDeleted: { $ne: true },

        };

        // Apply any filtering criteria to the query here, similar to the get function

        const count = await this.countDocuments(query);
        return count;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
SiteSchema.statics.updateSite = async function(body){
    if (body.location) {
        body.location = {
            type: 'Point',
            coordinates: body.location
        }
    }
    console.log(body.id);
    const site = await this.find({_id:body.id})
    if (!site)
        throw ApiError.notFound('site not found')
    //change last update 
    

    const newsite = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: body
    }, {
        new: true
    })
    return newsite;
}
SiteSchema.statics.softDelete = async function(id){
    try {
        const deletedData = await this.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (!deletedData) {
            throw new ApiError.notFound('site to delete not found');
        }
        return deletedData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = mongoose.model("Site", SiteSchema);
