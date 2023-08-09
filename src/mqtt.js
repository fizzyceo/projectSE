
var mqtt = require('async-mqtt')
const alertService = require('./service/systemManagement/alertService')
const deviceService = require('./service/systemManagement/deviceService')
const { logger } = require("./Logger");
const _ = require('lodash')
const fileData2 = require('../packet.json')
require('dotenv').config()
// Parse
const protocol = 'mqtt'
// const host = '127.0.0.1'
//free online broker
const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
})


const subscribe = async () => {
    try {
        console.log('Connected to mqtt');
        await client.subscribe('testk');
        client.on('message', async function (topic, message, packet) {

            let alertData = JSON.parse(message.toString())
            if (Array.isArray(alertData))
                alertData = alertData[0]
            const device = await deviceService.getMqttDeviceAndUpdate(_.omit(alertData, 'incidents'))
            if (device)
                await alertService.createMany(device, alertData.incidents)
        });
    }
    catch (e) {
        logger.error(JSON.stringify(e))
    }
}



client.on('connect', subscribe)

client.on('error', (error) => {
    logger.error(JSON.stringify(error))

})


client.on('reconnect', (error) => {
    logger.error(JSON.stringify(error))
})

// const subscribe2 = async (fileData) => {
//     try {
//         console.log('Connected to mqtt');
//             // let alertData = JSON.parse(message.toString())
//         // const device = await deviceService.getMqttDeviceAndUpdate(_.omit(fileData[0], 'incidents'))
//         const device = {
//             _id: "64b9e8ad76b89a22458c5708",
//             wilaya: "kkkkk",
//             region:"xxxx"
//         }
//         const alerts = await alertService.createMany(device, fileData[0].incidents)
//     }
//     catch (e) {
//         logger.error(JSON.stringify(e))
//     }
// }

// setTimeout(async() => {
//     await subscribe2(fileData2)
// }, 5000)



// const publish = async () => {
//     console.log("Starting");
//     try {
//         let alert = JSON.stringify({
//             "alertId": "5f9f5b1a9d9bggg1e1b1c9d9b1e",
//             "type": "fire",
//             "location": [
//                 36.7525,
//                 3.041972
//             ],
//             "wilaya": "Algiers2",
//             "region": "Bab Ezzouar",

//         })
//         await client.publish("test", alert);

//         // This line doesn't run until the server responds to the publish
//         await client.end();
//         // This line doesn't run until the client has disconnected without error
//         console.log("Done");
//     } catch (e) {
//         // Do something about it!
//         console.log(e.stack);
//     }
// }


//     client.on('connect', publish)


