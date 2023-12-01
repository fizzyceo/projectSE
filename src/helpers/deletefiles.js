const fs = require('fs');
const url = require('url');
const path = require('path');

const deleteImagesFromServer = async (imageUrls) => {

    await Promise.all(
        imageUrls.map(imageUrl => {
            const parsedUrl = url.parse(imageUrl);
            const imagePath = parsedUrl.pathname;
            //decode path
            const decodedPath = decodeURIComponent(imagePath);
            fs.unlink(
                path.resolve(`./public${decodedPath}`)
                , (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Image file deleted successfully.');
                });
        })
    )
}


module.exports = deleteImagesFromServer;