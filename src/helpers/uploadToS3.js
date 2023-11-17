const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../cloud/s3Client");

const uploadToS3 = (fileStream, Key, size= '') => {
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Body: fileStream,
        Key
    };
    const putCommand = new PutObjectCommand(uploadParams);
    return new Promise(async (resolve, reject) => {
        try {
            await s3Client.send(putCommand);
            const url = `https://${uploadParams.Bucket}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${uploadParams.Key}`
            resolve({ url, size });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = uploadToS3;