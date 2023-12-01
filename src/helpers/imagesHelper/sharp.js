const sharp = require('sharp');

//post size image
const imageBuffer = async (fileBuffer) => await sharp(fileBuffer).resize({height: 300, width: 500, fit: 'contain'}).toBuffer();

module.exports = imageBuffer;