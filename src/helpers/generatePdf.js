
const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment')
const path = require('path');
const { dateToHrMn, convertTimeToAmAndPm } = require('./dateTime')
const dotenv = require('dotenv')
dotenv.config()

const checkDirectory = () => {
    
    const normalPath = `./public/visitorsPasses/`;
    const directory = normalPath.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

// function generatePassPdf(visitorPass,lang="en") {
//     //get month+day as Jan-30
//     const timestamp = + new Date();
//     const dateToMonthName = moment(visitorPass.date).format('MMM') + '-' + moment(visitorPass.date).format('DD')
//     const passTime = convertTimeToAmAndPm(dateToHrMn(visitorPass.date))
//     // make pass time am and pm 

//     const screenWidth = 320;
//     const screenHeight = 450;
//     const doc = new PDFDocument({ size: [screenWidth, screenHeight] });
//     let imagePath = visitorPass.qrImage.split('/').slice(3).join('/').replace('images', './public/images')
//     checkDirectory()
//     let pdfPath = `visitorsPasses/${123}-pass.pdf`
//     let pdfUrl = process.env.SERVER_URL + "/" + pdfPath
//     const stream = doc.pipe(fs.createWriteStream(path.resolve(`./public/${pdfPath}`)));

//     if (lang === "en") {
//         doc.font('Times-Roman')
//             .fontSize(25)
//             .text(`${visitorPass.visitorId.tenantId.venueId.name}`, 105, 40)
//             .moveDown()
//             .moveDown()
//             .image(path.resolve(imagePath), 75, 60,)
//             .moveDown()
//             .fontSize(12)
//         // Iwant the pass code under the qr image then a space next to the code ten the time 
//         .text(`Pass Code No: ${visitorPass.code || ' '}     ${passTime}  ${dateToMonthName} `, 20, 200)
//         // draw a line under the code and the time
//         .text(`____________________________________`)
//         .moveDown()
//         .text(`Full Name:                         ${visitorPass.visitorId.fullName || ' '}`)
//         .moveDown(0.5)
//         .text(`Phone Number:                  ${visitorPass?.visitorId?.phone || ' '}`)
//         .moveDown(0.5)
//         .text(`Car Number:                      ${visitorPass?.carNumber || ' '}`)
//         .moveDown(0.5)
//         .text(`Venue Address:                   ${visitorPass?.visitorId?.tenantId?.venueId?.address || ' '}`)
//         .moveDown(0.5)

//         .text(`____________________________________`)

//         .moveDown()
//             .text(`         Powered by:  www.mycompound.net`)
//     }
//     if (lang === "ar") {
//         doc.font(path.resolve(`fonts/amiri.ttf`))
//             .text(`${visitorPass.visitorId.tenantId.venueId.name}`, 105, 40)
//             .moveDown()
//             .moveDown()
//             .image(path.resolve(imagePath), 75, 60,)
//             // .text(`_______________________`)
//             .moveDown()
//             .moveDown()
//             .moveDown()
//             .moveDown()
//             .moveDown()
//             .moveDown()

//             .fontSize(12)
//             // .text(`${visitorPass.code || ' '}`, { lineBreak: false })
//             .text(`رقم التصريح: `, { features: ['rtla'],  }, 20, 200)
//             // .text(`_______________________`)
//             .moveDown()
//             // .text(`${visitorPass.visitorId.fullName || ' '}`, { lineBreak: false })
//             .text(`الاسم الكامل:            `, { features: ['rtla'] })
//             .moveDown()
//             // .text(`${visitorPass?.visitorId?.phone || ' '}`, { lineBreak: false })
//             .text(`رقم الهاتف:        `, { features: ['rtla']})
//             .moveDown()
//             // .text(`${visitorPass?.carNumber || ' '}`, { lineBreak: false })
//             .text(`رقم السيارة:       `, { features: ['rtla'] })
//             .moveDown()
//             // .text(`${visitorPass?.visitorId?.tenantId?.venueId?.address || ' '}`, { lineBreak: false })
//             .text(`عنوان المكان:           `, { features: ['rtla'] })
//             .moveDown(0.5)
//             .text(`_____________________`)
//             .moveDown()
//             .text(" www.mycompound.net", { lineBreak: false })
//             .text(`بواسطة:  `, { features: ['rtla'] });

//     }
//     doc.end();
//     console.log(pdfUrl);
//     return pdfUrl

// }

// function reverse(text) {
//     return text.split('').reverse().join('');
// }

// let visitorPass = {
//     "_id": "641fead0c2109833f5e2894e",
//     "visitorId": {
//         "_id": "641fe9e75af4510d129221dc",
//         "email": "visitor1@visitor.com",
//         "fullName": "visitor6",
//         "phone": "111111111",
//         "tenantId": {
//             "_id": "641fe51d8965e2f29e8773d1",
//             "venueId": {
//                 "_id": "641fdc59a2081e5af2876b2b",
//                 "name": "venue3",
//                 "address": "city of lalaland"
//             }
//         }
//     },
//     "date": "2023-03-04T03:00:00.000Z",
//     "qrImage": "http://192.162.71.201:4052/images/qrCodes/qr-8756564-1679813328361.png",
//     "status": "Cancelled",
//     "purpose": "for playing",
//     "carNumber": "123456",
//     "code": "3972571",
//     "createdAt": "2023-03-26T06:48:48.387Z",
//     "updatedAt": "2023-03-26T08:19:57.125Z"
// }

// generatePassPdf(visitorPass,"ar")

// module.exports = { generatePassPdf }


const PdfPrinter = require('pdfmake');

function generatePassPdf(visitorPass, lang = 'en') {
    
    const timestamp = +new Date();
    const dateToMonthName = moment(visitorPass.date).format('MMM') + '-' + moment(visitorPass.date).format('DD');
    const passTime = convertTimeToAmAndPm(dateToHrMn(visitorPass.date));

    let imagePath = visitorPass.qrImage.split('/').slice(3).join('/').replace('images', './public/images');
    checkDirectory();
    let pdfPath = `visitorsPasses/${timestamp}-pass.pdf`;
    let pdfUrl = process.env.SERVER_URL + "/" + pdfPath;

    const fonts = {
        Roboto: {
            normal: path.resolve('fonts/amiri.ttf'),
            bold: path.resolve('fonts/amiri.ttf'),
        },
    };
    if (lang === "en") {
        docDefinition = {
            content: [
                { text: visitorPass.visitorId.tenantId.venueId.name, fontSize: 30, alignment: 'center', margin: [0, 20] },

                { image: path.resolve(imagePath), width: 200, height: 200, alignment: 'center', margin: [0, 20] },
                // add line
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 500, y2: 0,
                        }
                    ]
                },
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body: [
                            [
                                { text: "Pass Code No:" , fontSize: 18, margin: [100, 5, 0, 0] },
                                { text: `${visitorPass.code}`, fontSize: 18, alignment: 'left', margin: [50, 5, 0, 0] },
                            ],
                            [
                                { text: "Full Name:" , fontSize: 18, alignment: 'left', margin: [100, 5, 0, 0] },
                                { text: `${visitorPass.visitorId.fullName}`, fontSize: 18, alignment: 'left', margin: [50, 5, 0, 0] },
                            ],
                            [
                                { text: "Phone Number:" , fontSize: 18, alignment: 'left', margin: [100, 5, 0, 0] },
                                { text: `${visitorPass.visitorId.phone}`, fontSize: 18, alignment: 'left', margin: [50, 5, 0, 0] },
                            ],
                            [
                                { text: "Car Number:" , fontSize: 18, alignment: 'left', margin: [100, 5, 0, 0] },
                                { text: `${visitorPass.carNumber}`, fontSize: 18, alignment: 'left', margin: [50, 5, 0, 0] },
                            ],
                            [
                                { text: "Address:" , fontSize: 18, alignment: 'left', margin: [100, 5, 0, 0] },
                                { text: `${visitorPass.visitorId.tenantId.venueId.address}`, fontSize: 18, alignment: 'left', margin: [50, 5, 0, 0] },
                            ],
                            [
                                { text: "Date:" , fontSize: 18, alignment: 'left', margin: [100, 5, 0, 0] },
                                { text: `${dateToMonthName}`, fontSize: 18, alignment: 'left', margin: [50, 5, 0, 0] },
                            ],
                            [
                                { text: "Time:", fontSize: 18, alignment: 'left', margin: [100, 5, 0, 0] },
                                { text: `${passTime}`, fontSize: 18, alignment: 'left', margin: [50, 5, 0, 0] },
                            ]
                        ],
                    },

                    layout: 'noBorders',
                },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 500, y2: 0,
                        }
                    ]
                },
                {
                    style: 'tableExample2',
                    table: {
                        headerRows: 1,
                        body: [
                            [
                                { text: "Powered By" , fontSize: 14, alignment: 'left', margin: [150, 10, 0, 0] },
                                { text: `www.mycompound.net`, fontSize: 14, alignment: 'left', margin: [20, 10, 0, 0] },
                            ]
                        ],
                    },
                    layout: 'noBorders',
                },
            ],

            defaultStyle: { font: 'Roboto' },
        };
    }

    if (lang === "ar") {
        docDefinition = {
            content: [
                { text: visitorPass.visitorId.tenantId.venueId.name, fontSize: 30, alignment: 'center', margin: [0, 20] },

                { image: path.resolve(imagePath), width: 200, height: 200, alignment: 'center', margin: [0, 20] },
                // add line
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 500, y2: 0,
                        }
                    ]
                },
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body: [
                            [
                                { text: `${visitorPass.code}`, fontSize: 18, alignment: 'right', margin: [150, 0, 0, 0] },
                                { text: "التصريح رقم", fontSize: 18, margin: [70, 0, 0, 0] },
                            ],
                            [
                                { text: `${visitorPass.visitorId.fullName}`, fontSize: 18, alignment: 'right', margin: [100, 0, 0, 0] },
                                { text: "الكامل  الاسم", fontSize: 18, alignment: 'right', margin: [50, 0, 0, 0] },
                            ],
                            [
                                { text: `${visitorPass.visitorId.phone}`, fontSize: 18, alignment: 'right', margin: [100, 0, 0, 0] },
                                { text:  "الهاتف رقم ", fontSize: 18, alignment: 'right', margin: [50, 0, 0, 0] },
                            ],
                            [
                                { text: `${visitorPass.carNumber}`, fontSize: 18, alignment: 'right', margin: [100, 0, 0, 0] },
                                { text: "السيارة رقم", fontSize: 18, alignment: 'right', margin: [50, 0, 0, 0] },
                            ],
                            [
                                { text: `${visitorPass.visitorId.tenantId.venueId.address}`, fontSize: 18, alignment: 'right', margin: [100, 0, 0, 0] },
                                { text:  "العنوان", fontSize: 18, alignment: 'right', margin: [50, 0, 0, 0] },
                            ],
                            [
                                { text: `${dateToMonthName}`, fontSize: 18, alignment: 'right', margin: [100, 0, 0, 0] },
                                { text:  "التاريخ", fontSize: 18, alignment: 'right', margin: [50, 0, 0, 0] },
                            ],
                            [
                                { text: `${passTime}`, fontSize: 18, alignment: 'right', margin: [50, 0, 0, 0] },
                                { text: "الوقت", fontSize: 18, alignment: 'right', margin: [50, 0, 0, 0] },
                            ]
                        ],
                    },

                    layout: 'noBorders',
                },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 500, y2: 0,
                        }
                    ]
                },
                {
                    style: 'tableExample2',
                    table: {
                        headerRows: 1,
                        body: [
                            [
                                { text: `www.mycompound.net`, fontSize: 16, alignment: 'right', margin: [130,10, 0, 0] },
                                { text: "قبل من مشغل ", fontSize: 14, alignment: 'right', margin: [30, 10, 0, 0] },
                            ]
                        ],
                    },
                    layout: 'noBorders',
                },
            ],

            defaultStyle: { font: 'Roboto' },
        };
    }
    // ,

    const printer = new PdfPrinter(fonts);
    const pdfKitDoc = printer.createPdfKitDocument(docDefinition);
    const stream = fs.createWriteStream(path.resolve(`./public/${pdfPath}`));
    pdfKitDoc.pipe(stream);
    pdfKitDoc.end();

    console.log(pdfUrl);
    return pdfUrl;
}



// let visitorPass = {
//     "_id": "641fead0c2109833f5e2894e",
//     "visitorId": {
//         "_id": "641fe9e75af4510d129221dc",
//         "email": "visitor1@visitor.com",
//         "fullName": "visitor6",
//         "phone": "111111111",
//         "tenantId": {
//             "_id": "641fe51d8965e2f29e8773d1",
//             "venueId": {
//                 "_id": "641fdc59a2081e5af2876b2b",
//                 "name": "venue3",
//                 "address": "city of lalaland"
//             }
//         }
//     },
//     "date": "2023-03-04T03:00:00.000Z",
//     "qrImage": "http://192.162.71.201:4052/images/qrCodes/qr-8756564-1679813328361.png",
//     "status": "Cancelled",
//     "purpose": "for playing",
//     "carNumber": "123456",
//     "code": "39720000571",
//     "createdAt": "2023-03-26T06:48:48.387Z",
//     "updatedAt": "2023-03-26T08:19:57.125Z"
// }


// generatePassPdf(visitorPass, "ar")

module.exports = { generatePassPdf }
