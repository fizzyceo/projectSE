const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../cloud/s3Client");
const { logger } = require('../Logger');

const deleteFromCloud = async (...urls) => {
    try {
        const deletePromises = [];
        urls.forEach(url => {
            const Key = url.split('amazonaws.com/')[1];
            if (Key) {
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key
                };
                const command = new DeleteObjectCommand(params);
                deletePromises.push(s3Client.send(command));
            } else {
                logger.info(`url ${url} is not uploaded to cloud`);
            }
        })
        await Promise.all(deletePromises);
        logger.info('success delete from cloud');
    } catch (error) {
        logger.error(error.message);
        logger.error('failed to delete from cloud');
    }
}

module.exports = deleteFromCloud;