var mqtt = require("async-mqtt");
const alertService = require("./service/systemManagement/alertService");
const deviceService = require("./service/systemManagement/deviceService");
const historicalTemp = require("./service/systemManagement/HistoricalTempHumService");
const siteService = require("./service/systemManagement/SiteService");

const historicalWind = require("./service/systemManagement/HistoricalWindService");
const { logger } = require("./Logger");
const _ = require("lodash");
const fileData2 = require("../packet.json");
const { log } = require("winston");
const { getUniqueId } = require("./helpers/getUniqueId");
const moment = require("moment");

const classifySite = require("./helpers/classifySite");
const {
  TEMP_RECORD_TIME,
  WIND_RECORD_TIME,
  RULE30_COUNT_TO_FLAG_DANGER,
  FDI_COUNT_TO_FLAG_DANGER,
} = require("./config/timers");

require("dotenv").config();
const protocol = "mqtt";

//setting up the connection

//subscribtion to the topic and the broker

const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;

const mqttClient = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000,
});
let danger_counter_fdi = 0;
let danger_counter_rule30 = 0;
const subscribe = async () => {
  try {
    /**NORMALMENT HNAYA KEYEN LOGIC TE3 SITE CLASSIFICATION.... */

    console.log("Connected to mqtt");
    let avgTempPerRecord = 0;
    let avgHumidityPerRecord = 0;
    let avgWindSpeedPerRecord = 0;

    await mqttClient.subscribe("dgf/iot/backend");
    let currentTime = new Date().getTime();

    mqttClient.on("message", async function (topic, message, packet) {
      //decode the packet
      let alertData = JSON.parse(message.toString());

      if (Array.isArray(alertData)) alertData = alertData[0];
      //fetch device and update its infos
      console.log(alertData);
      const device = await deviceService.getDevices({
        devId: alertData.deviceId,
      });

      if (device.data.length > 0) {
        await deviceService.updateDevice(
          "",
          device.data[0]._id, //this is a problem because it accepts _id not deviceId
          {
            status: alertData.status === 1 ? "online" : "offline",
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

      //check if it's time to create a new row in the historical table

      const ElapsedTime = alertData.ts * 1000 - currentTime;
      console.log("Elapsed time: " + ElapsedTime);

      // utilize the content of the packet
      if (alertData.type === "temp") {
        if (ElapsedTime < TEMP_RECORD_TIME) {
          avgTempPerRecord =
            avgTempPerRecord > 0
              ? (avgTempPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
          avgHumidityPerRecord =
            avgHumidityPerRecord > 0
              ? (avgHumidityPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
        } else {
          const HistTempbody = {
            deviceId: device.data[0]._id,
            humidity: avgHumidityPerRecord,
            temperature: avgTempPerRecord,
            detectionTime: alertData.ts * 1000,
          };
          const temp_hum = await historicalTemp.createHistTemp(HistTempbody);

          if (!temp_hum) {
            throw Error("error creating temperature humidity row!");
          }
          //reinitialize the current time, avg value for the next packet
          avgHumidityPerRecord = 0;
          avgTempPerRecord = 0;

          currentTime = new Date().getTime();
        }
      } else if (alertData.type === "wind") {
        if (ElapsedTime < WIND_RECORD_TIME) {
          avgWindSpeedPerRecord =
            avgWindSpeedPerRecord > 0
              ? (avgWindSpeedPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
        } else {
          const WindBody = {
            deviceId: device.data[0]._id,
            speed: avgWindSpeedPerRecord,
            direction: alertData.wind.direction,
            detectionTime: alertData.ts * 1000,
          };
          const wind_row = await historicalWind.createHistWind(WindBody);
          if (!wind_row) {
            throw Error("error creating wind row!");
          }
          //reinitialize the current time, avg value for the next packet
          avgWindSpeedPerRecord = 0;
          currentTime = new Date().getTime();
        }
      } else if (alertData.type === "windTemp") {
        if (ElapsedTime < WIND_RECORD_TIME) {
          avgWindSpeedPerRecord =
            avgWindSpeedPerRecord > 0
              ? (avgWindSpeedPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
        } else {
          const WindBody = {
            deviceId: device.data[0]._id,
            speed: alertData.wind.speed,
            direction: alertData.wind.direction,
            detectionTime: alertData.ts * 1000,
          };
          const wind_row = await historicalWind.createHistWind(WindBody);

          if (!wind_row) {
            throw Error("error creating wind row!");
          }
          currentTime = new Date().getTime();

          console.log(wind_row);
        }
        if (ElapsedTime < TEMP_RECORD_TIME) {
          avgTempPerRecord =
            avgTempPerRecord > 0
              ? (avgTempPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
          avgHumidityPerRecord =
            avgHumidityPerRecord > 0
              ? (avgHumidityPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
        } else {
          const HistTempbody = {
            deviceId: device.data[0]._id,
            humidity: avgHumidityPerRecord,
            temperature: avgTempPerRecord,
            detectionTime: alertData.ts * 1000,
          };
          const temp_hum = await historicalTemp.createHistTemp(HistTempbody);
          if (!temp_hum) {
            throw Error("error creating temperature humidity row!");
          }
          //reinitialize the current time, avg value for the next packet
          avgHumidityPerRecord = 0;
          avgTempPerRecord = 0;
          avgWindSpeedPerRecord = 0;

          currentTime = new Date().getTime();

          console.log(
            "successfull windTemp packet treatment! ----------------------------------------------------------------"
          );
        }
      }

      const { siteClassification30, siteClassificationFDI, siteId } =
        await classifySite(alertData.siteId);
      console.log(siteClassificationFDI);
      if (
        siteClassification30 !== "Danger" &&
        !siteClassificationFDI.danger
      ) {
        //change the status if its not dangerous
        const modifiedSite = await siteService.updateSite(siteId, {
          status30: siteClassification30,
          statusFDI: siteClassificationFDI.type,
          isDangerous: siteClassificationFDI.danger
        });
      } else {
        
        //if the  status is dangerous => checjk the counters before flagging it & senting alerts

        if (siteClassification30 === "Danger") {
          if (danger_counter_rule30 >= RULE30_COUNT_TO_FLAG_DANGER) {
            const modifiedSite = await siteService.updateSite(siteId, {
              status30: siteClassification30,
            });
            if (!modifiedSite) {
              throw new Error("error applying the status update to the site");
            }
            
            //here the sendALert

          } else {
            danger_counter_rule30++;
            console.log(danger_counter_rule30);
          }
        }

        if (siteClassificationFDI.danger) {
          if (danger_counter_fdi >= FDI_COUNT_TO_FLAG_DANGER) {
            //handle danger by setting the status to "danger" and senting an alert,
            //  const res =await handleDanger(siteId, siteClassificationFDI, "FDI")

            const modifiedSite = await siteService.updateSite(siteId, {
              statusFDI: siteClassificationFDI.type,
              isDangerous: siteClassificationFDI.danger

            });
            //sendAlert
            if (!modifiedSite) {
              throw new Error("error applying the status update to the site");
            }
          } else {
            danger_counter_fdi++;
          }
        }
      }

      //************** */ alert table handler **************

      //     const device = await deviceService.getMqttDeviceAndUpdate(_.omit(alertData, 'incidents'))
      // if (device)
      //     await alertService.createMany(device, alertData.incidents)
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
};

mqttClient.on("connect", subscribe);

mqttClient.on("error", (error) => {
  logger.error(JSON.stringify(error));
});

mqttClient.on("reconnect", (error) => {
  logger.error(JSON.stringify(error));
});

//it restarts everytime we restart the server, maybe we should consider using a new table for this data
// setInterval(() => {

//   listAllCacheKeys()
//   .then((keys) => {
//     console.log('All Cache Keys:');
//     keys.forEach((key, index) => {
//       console.log(`${index + 1}. ${key}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error listing cache keys:', error);
//   });
// }, 10000); // Check every 5 seconds (adjust as needed)

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
