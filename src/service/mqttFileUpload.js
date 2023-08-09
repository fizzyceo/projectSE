const bcrypt = require('bcryptjs');
const nextError = require('../helpers/errorTypeFunction');
const { getUniqueId } = require('../helpers/getUniqueId');
const MailService = require('./sendMailService/sendMail')
const _ = require('lodash');
const ApiError = require('../error/api-error');
const { db } = require('../models');
const sharp = require("sharp");
const fs = require("fs");
const path = require('path');
const { logger } = require("../Logger");
require('dotenv').config()
const checkDirectory = (folder) => {
    const normalPath = `./public/images/${folder}/normal/`;
    const smallPath = `./public/images/${folder}/small/`;

    const paths = [normalPath, smallPath];
    paths.forEach((path) => {
        const directory = path.split('/').slice(0, -1).join('/');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    });
};

// Separate function to handle file processing
async function handleFile(fileData, folder = 'random') {
    // Save the file to a temporary location

    try {

        const timestamp = + new Date();
        const tempFilePath = `temp/${timestamp}-${fileData.file.originalname}`
        await fs.promises.writeFile(tempFilePath, fileData.file.buffer)
        // Process the image using sharp (if it's an image file)
        const processedImage = await processImage(tempFilePath, folder, fileData);
        // Delete the temporary file
        fs.promises.unlink(path.join(__dirname,`../../${tempFilePath}`));
        return processedImage
    } catch (err) {
        console.error('Error processing image:', err);
    }
}


// Helper function to process the image using sharp
async function processImage(tempFilePath, folder, req, dimensions = { normal: { width: 900, height: 630 }, small: { width: 200, height: 150 } }) {

    const timestamp = + new Date();
    checkDirectory(folder);
    const smallUrl = `images/${folder}/normal/${timestamp}-${req.file.originalname}`
    const normalUrl = `images/${folder}/small/${timestamp}-${req.file.originalname}`
    const image = sharp(tempFilePath);
    const normalImagePath = path.resolve(`./public/${smallUrl}`);
    const smallImagePath = path.resolve(`./public/${normalUrl}`);
    await image.resize(dimensions.normal.width, dimensions.normal.height, { fit: sharp.fit.inside }).toFile(normalImagePath);
    await image.resize(dimensions.small.width, dimensions.small.height, { fit: sharp.fit.inside, }).toFile(smallImagePath);
    let newImageUrls = {
        normal: process.env.SERVER_URL + "/" + encodeURIComponent(smallUrl),
        small: process.env.SERVER_URL + "/" + encodeURIComponent(normalUrl)
    };
    return newImageUrls
}

// #region upload image 
const uploadImage = async (file, folder) => {
    try {
        let data = Buffer.from(file, 'base64');
        let fileData = {
            file: {
                originalname: `${+new Date()}.jpeg`,
                buffer: data
            },
            mimetype: 'jpeg',
            size: data.length
        }

        let image = await handleFile(fileData, folder)
        if (!image)
            throw new Error('Image not found')
        return image
    } catch (error) {
        logger.error(JSON.stringify(error))
    }
}

module.exports = {
    uploadImage
}


// Helper function to check if the file is an image
function isImageFile(filePath) {
    // Implement your logic to check if the file is an image (e.g., by checking the file extension)
    // Return true if it's an image, false otherwise 
}