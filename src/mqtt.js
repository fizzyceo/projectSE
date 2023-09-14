var mqtt = require("async-mqtt");
const alertService = require("./service/systemManagement/alertService");
const deviceService = require("./service/systemManagement/deviceService");
const historicalTemp = require("./service/systemManagement/HistoricalTempHumService");
const historicalWind = require("./service/systemManagement/HistoricalWindService");
const siteService = require("../service/systemManagement/SiteService");

const { logger } = require("./Logger");
const _ = require("lodash");
const fileData2 = require("../packet.json");
const { log } = require("winston");
const { getUniqueId } = require("./helpers/getUniqueId");
const moment = require('moment');

const TIME_TO_GO_OFFLINE = require("./config/systemManagement/TimeToGoOffline");
const classifySite = require("./helpers/classifySite");
require("dotenv").config();
// Parse
const protocol = "mqtt";
// const host = '127.0.0.1'
//free online broker
//setting up the connection
const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  // username: 'emqx',
  // password: 'public',
  reconnectPeriod: 1000,
});
//subscribtion to the topic and the broker
const deviceLastActivity = new Map();

const subscribe = async () => {
  try {
    /**NORMALMENT HNAYA KEYEN LOGIC TE3 SITE CLASSIFICATION.... */
    let siteStatus = "online"

    console.log("Connected to mqtt");
    await client.subscribe("alerts");

    client.on("message", async function (topic, message, packet) {
    
      let alertData = JSON.parse(message.toString());

      if (Array.isArray(alertData)) alertData = alertData[0];
      const device = await deviceService.getDevices({
        devId: alertData.deviceId,
      });
      // check which site this device belongs to
      // fetch all devices related to that site to retreive the average data 
      // device we can extract latest data
      if (device.data.length > 0) {
        const modified_device = await deviceService.updateDevice(
          "",
          device.data[0]._id, //this is a problem because it accepts _id not deviceId
          {
            status: alertData.status,
            statusDetails: alertData.statusDetails,
            battery: alertData.battery,
            signal: alertData.signal,
            lastOnline: moment(new Date()).format("YYYY-MM-DD HH:mm"),
            version: alertData.version,
          }
        );
      } else {
        throw new Error("no device with such Id!");
      }
      deviceLastActivity.set(device.data[0]._id, Date.now());
      
      if (alertData.type === "temp") {
        const HistTempbody = {
          deviceId: device.data[0]._id,
          humidity: alertData.temp.humidity,
          
          temperature: alertData.temp.temperature,
          detectionTime: alertData.ts,
        };
        const temp_hum = await historicalTemp.createHistTemp(HistTempbody);

        if (!temp_hum) {
          throw Error("error creating temperature humidity row!");
        }
      } else if (alertData.type === "wind") {

        const WindBody = {
          deviceId: device.data[0]._id,
          speed: alertData.wind.speed,
          direction: alertData.wind.direction,
          detectionTime: alertData.ts,
        };
        const wind_row = await historicalWind.createHistWind(WindBody);
        if (!wind_row) {
          throw Error("error creating wind row!");
        }
      } else if (alertData.type === "windTemp") {

        const WindBody = {
          deviceId: device.data[0]._id,
          speed: alertData.wind.speed,
          direction: alertData.wind.direction,
          detectionTime: alertData.ts,
        };
        const wind_row = await historicalWind.createHistWind(WindBody);
        if (!wind_row) {
          throw Error("error creating wind row!");
        }

        const HistTempbody = {
          deviceId: device.data[0]._id,
          humidity: alertData.temp.humidity,
          temperature: alertData.temp.temperature,
          detectionTime: alertData.ts,
        };
        const temp_hum = await historicalTemp.createHistTemp(HistTempbody);

        if (!temp_hum) {
          throw Error("error creating temperature humidity row!");
        }
   
      }
      //extract all devices from that siteId
      // extract latest data from each device 
      //
      const classifiedSite = await classifySite(alertData.siteId)
      console.log("*////////**/*/*/",classifiedSite);
      //modify the site status on the table 
      //************** */ alert table handler **************

      //     const device = await deviceService.getMqttDeviceAndUpdate(_.omit(alertData, 'incidents'))
      // if (device)
      //     await alertService.createMany(device, alertData.incidents)
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
};

client.on("connect", subscribe);

client.on("error", (error) => {
  logger.error(JSON.stringify(error));
});

client.on("reconnect", (error) => {
  logger.error(JSON.stringify(error));
});

//it restarts everytime we restart the server, maybe we should consider using a new table for this data 
setInterval(() => {
  const now = Date.now();
  const lastOnline = moment(new Date()).format("YYYY-MM-DD HH:mm")
  
  deviceLastActivity.forEach((lastActivityTime, deviceId) => {
    // Calculate the time elapsed since last activity
    const timeElapsed = now - lastActivityTime;
    // If the device has been idle for too long, mark it as offline
    if (timeElapsed >= TIME_TO_GO_OFFLINE) {

      deviceService.updateDevice("", deviceId, { status: "offline" })
        .then((modified_device) => {
          //we can apply the alert logic here!
          console.log(`Device ${deviceId} marked as offline`);

        })
        .catch((error) => {
          logger.error(`Error marking device ${deviceId} as offline: ${error}`);
        });

      // // Remove the device from the tracking map
      // deviceLastActivity.delete(deviceId);
    }
  });
}, 5000); // Check every 5 seconds (adjust as needed)

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
