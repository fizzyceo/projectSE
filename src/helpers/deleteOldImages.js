const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../cloud/s3Client");
const { logger } = require("../Logger");

const deleteOldImages = (oldImageUrls) => {
    const keyForNormal = oldImageUrls.normal.split('.amazonaws.com/')[1];
    let deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: keyForNormal
    };
    let deleteCommand = new DeleteObjectCommand(deleteParams);
    s3Client.send(deleteCommand).catch(err => {
        logger.error(`failed to delete old file ${keyForNormal} from s3`);
        logger.error(err.message);
    });

    const keyForSmall = oldImageUrls.small.split('.amazonaws.com/')[1];
    deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: keyForSmall
    };
    deleteCommand = new DeleteObjectCommand(deleteParams);
    s3Client.send(deleteCommand).catch(err => {
        logger.error(`failed to delete old file ${keyForSmall} from s3`);
        logger.error(err.message);
    });
};

module.exports = deleteOldImages