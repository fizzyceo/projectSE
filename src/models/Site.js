const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require("../helpers/getUniqueId");
const moment = require("moment");
const ApiError = require("../error/api-error");

const SiteSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },

    name: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      type: pointSchema,
    },
    wilaya: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline", "semi-online", "danger"],
      default: "online",
    },
    statusFDI: {
      type: String,

      default: "online",
    },
    status30: {
      type: String,

      default: "online",
    },
    isDangerous: {
      type: Boolean,
      default: false,
    },
    statusDetails: {
      type: String,
      default: "ok",
    },
    contact:{
      type:Number
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

SiteSchema.statics.createSite = async function (body) {
  console.log("*/////////////////////**");
  const exists = await this.findOne({ name: body.name });
  console.log(exists);
  if (exists) throw ApiError.badRequest("Site already exist");
  if (body.location) {
    body.location = {
      type: "Point",
      coordinates: body.location,
    };
  }
  body.code = await getUniqueId(this);

  const site = new this(body);
  await site.save();
  return site;
};

SiteSchema.statics.getSites = async function (body) {
  try {
    const page = (body?.page || 1) - 1;
    const limit = body?.limit || 10;
    const skip = page * limit;
    const sort = [
      [body?.sortField || "createdAt", body?.sortDirection || "desc"],
    ];
    let options = {
      code: 1,
      name: 1,
      status: 1,
      statusFDI: 1,
      status30: 1,
      location: 1,
      wilaya: 1,
      region: 1,
      statusDetails: 1,
      isDeleted: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const sites = await this.find(
      {
        isDeleted: { $ne: true },
        ...(body?.wilaya && { wilaya: body?.wilaya }),

        ...(body?.region && { region: body?.region }),

        ...(body?.status && { status: body?.status }),
        ...(body?.statusFDI && { statusFDI: body?.statusFDI }),
        ...(body?.status30 && { status30: body?.status30 }),

        ...(body?.code && { code: body?.code }),
        ...(body?.name && { name: body?.name }),
        ...(body?.search && {
          $or: [
            { code: { $regex: body?.search, $options: "i" } },
            { name: { $regex: body?.search, $options: "i" } },
            { status: { $regex: body?.search, $options: "i" } },

            { wilaya: { $regex: body?.search, $options: "i" } },
            { region: { $regex: body?.search, $options: "i" } },
          ],
        }),
        ...(body?.location && {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: body?.location,
              },
              // $maxDistance: body?.maxDistance
            },
          },
        }),
        ...(body?.dateFrom &&
          body?.dateTo && {
            createdAt: { $gte: body?.dateFrom, $lte: body?.dateTo },
          }),
      },
      options
    )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .cache("site")
      .lean();
    return sites;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

SiteSchema.statics.getOne = async function (id) {
  const site = await this.findOne({
    _id: id,
  })
    .cache("site")
    .lean();
  if (!site) throw ApiError.notFound("Device not found");
  return site;
};
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
};
SiteSchema.statics.updateSite = async function (body) {
  if (body.location) {
    body.location = {
      type: "Point",
      coordinates: body.location,
    };
  }
  console.log(body.id);
  const site = await this.find({ _id: body.id });
  if (!site) throw ApiError.notFound("site not found");
  //change last update

  const newsite = await this.findByIdAndUpdate(
    {
      _id: body.id,
    },
    {
      $set: body,
    },
    {
      new: true,
    }
  );
  return newsite;
};
SiteSchema.statics.softDelete = async function (id) {
  try {
    const deletedData = await this.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!deletedData) {
      throw new ApiError.notFound("site to delete not found");
    }
    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = mongoose.model("Site", SiteSchema);
