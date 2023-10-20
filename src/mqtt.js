var mqtt = require("async-mqtt");
const alertService = require("./service/systemManagement/alertService");
const deviceService = require("./service/systemManagement/deviceService");
const historicalTemp = require("./service/systemManagement/HistoricalTempHumService");
const siteService = require("./service/systemManagement/SiteService");
const SiteHistoryService = require("./service/systemManagement/SiteHistoryService");

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
const historical_temphum = require("./models/historical_temphum");

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

let ElapsedTime = null

const deviceElapsedTimes = new Map();
// Map for average temperature per device
const avgTempMap = new Map();

// Map for average humidity per device
const avgHumidityMap = new Map();

// Map for average wind speed per device
const avgSpeedMap = new Map();

const subscribe = async () => {
  try {
    /**NORMALMENT HNAYA KEYEN LOGIC TE3 SITE CLASSIFICATION.... */

    console.log("Connected to mqtt");
    let avgTempPerRecord = 0;
    let avgHumidityPerRecord = 0;
    let avgWindSpeedPerRecord = 0;

    await mqttClient.subscribe("dgf/iot/backend");

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

      //this should be unique to each device, because we could have multiple devices reporting to this server
      const previousElapsedTime = deviceElapsedTimes.get(device.data[0]._id);
      if (previousElapsedTime !== undefined) {
        ElapsedTime = previousElapsedTime;
      } else {
        const last_historical_data = await historical_temphum.getHistoricalTemphum({
          limit: 1,
          sortDirection: "desc",
          deviceId: device.data[0]._id,
        });
      
        if (last_historical_data.length > 0) {
          
          const createdAtTimestamp = new Date(last_historical_data[0].createdAt).getTime();
          const currentTime = new Date().getTime();
      
          ElapsedTime = currentTime - createdAtTimestamp;
          deviceElapsedTimes.set(device.data[0]._id, ElapsedTime);
        }
      }
      
      console.log("Elapsed time: " + ElapsedTime + " FOR DEVICE " + alertData.deviceId);


      // utilize the content of the packet
      if (alertData.type === "temp") {
          avgHumidityMap.set(device.data[0]._id,alertData.temp.humidity);
          avgTempMap.set(device.data[0]._id,alertData.temp.temperature);
        if (ElapsedTime > TEMP_RECORD_TIME) {
          avgTempPerRecord =
            avgTempPerRecord > 0
              ? (avgTempPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
          avgHumidityPerRecord =
            avgHumidityPerRecord > 0
              ? (avgHumidityPerRecord + alertData.temp.humidity) / 2
              : alertData.temp.humidity;

          avgHumidityMap.set(device.data[0]._id,avgHumidityPerRecord);
          avgTempMap.set(device.data[0]._id,avgTempPerRecord);
        } else {
          const HistTempbody = {
            deviceId: device.data[0]._id,
            humidity: avgHumidityMap.get( device.data[0]._id) ||  alertData.temp.humidity,
            temperature: avgTempMap.get( device.data[0]._id) ||  alertData.temp.temperature,
            detectionTime: alertData.ts * 1000,
          };

          const temp_hum = await historicalTemp.createHistTemp(HistTempbody);

          if (!temp_hum) {
            throw Error("error creating temperature humidity row!");
          }
          //reinitialize the current time, avg value for the next packet
          avgHumidityPerRecord = 0;
          avgTempPerRecord = 0;

        }
      } else if (alertData.type === "wind") {
        if (ElapsedTime > WIND_RECORD_TIME) {
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
        }
      } else if (alertData.type === "windTemp") {

        avgHumidityMap.set(device.data[0]._id,alertData.temp.humidity);
        avgTempMap.set(device.data[0]._id,alertData.temp.temperature);
        avgSpeedMap.set(device.data[0]._id,alertData.wind.speed);

        if (ElapsedTime < WIND_RECORD_TIME) {
          avgWindSpeedPerRecord =
            avgWindSpeedPerRecord > 0
              ? (avgWindSpeedPerRecord + alertData.wind.speed) / 2
              : alertData.wind.speed;
              avgSpeedMap.set(device.data[0]._id,avgWindSpeedPerRecord)

        } else {
          const WindBody = {
            deviceId: device.data[0]._id,
            speed:  avgSpeedMap.get(device.data[0]._id) || alertData.wind.speed ,
            direction: alertData.wind.direction,
            detectionTime: alertData.ts * 1000,
          };
          const wind_row = await historicalWind.createHistWind(WindBody);

          if (!wind_row) {
            throw Error("error creating wind row!");
          }

          console.log(wind_row);
        }
        if (ElapsedTime < TEMP_RECORD_TIME) {

          avgTempPerRecord =
            avgTempPerRecord > 0
              ? (avgTempPerRecord + alertData.temp.temperature) / 2
              : alertData.temp.temperature;
          avgHumidityPerRecord =
            avgHumidityPerRecord > 0
              ? (avgHumidityPerRecord + alertData.temp.humidity) / 2
              : alertData.temp.humidity;
              ElapsedTime
          avgHumidityMap.set(device.data[0]._id,avgHumidityPerRecord);
          avgTempMap.set(device.data[0]._id,avgTempPerRecord);
        } else {
          console.log("Done temp calculation",avgTempMap.get(device.data[0]._id),ElapsedTime,TEMP_RECORD_TIME);
          const HistTempbody = {
            deviceId: device.data[0]._id,
            humidity: avgHumidityMap.get( device.data[0]._id) ||  alertData.temp.humidity,
            temperature: avgTempMap.get( device.data[0]._id) ||  alertData.temp.temperature,
            detectionTime: alertData.ts * 1000,
          };
          const temp_hum = await historicalTemp.createHistTemp(HistTempbody);
          if (!temp_hum) {
            throw Error("error creating temperature humidity row!");
          }
          const { siteClassification30, siteClassificationFDI, siteId } =
          await classifySite(alertData,alertData.siteId);
          const siteHistoryBody = {
            siteId:siteId,
            deviceId: device.data[0]._id,
            humidity: avgHumidityMap.get( device.data[0]._id) ||  alertData.temp.humidity,
            temperature: avgTempMap.get( device.data[0]._id) ||  alertData.temp.temperature,
            speed:  avgSpeedMap.get(device.data[0]._id) || alertData.wind.speed ,
            statusFDI:siteClassificationFDI.type,
            isDangerous:siteClassificationFDI.danger,
            status30:siteClassification30,
            direction: alertData.wind.direction,
            detectionTime: alertData.ts * 1000,

          }
          console.log(siteHistoryBody);
          
          const newHistory_Site = await SiteHistoryService.create(siteHistoryBody)
          console.log(newHistory_Site)
     // Clear elapsed time for the device
          deviceElapsedTimes.set(device.data[0]._id, 0);

     // Clear averages for the device
          avgHumidityMap.set(device.data[0]._id, 0);
          avgTempMap.set(device.data[0]._id, 0);
          avgSpeedMap.set(device.data[0]._id, 0);

          console.log(
            "successfull windTemp packet treatment! ----------------------------------------------------------------"
          );
        }
      }

      const { siteClassification30, siteClassificationFDI, siteId } =
        await classifySite(alertData,alertData.siteId);
      console.log(siteClassificationFDI,siteClassification30);
      if (
        siteClassification30 !== "danger" &&
        !siteClassificationFDI?.danger
      ) {
        //change the status if its not dangerous
        const modifiedSite = await siteService.updateSite(siteId, {
          status30: siteClassification30,
          statusFDI: siteClassificationFDI?.type,
          isDangerous: siteClassificationFDI?.danger
        });
      } else {
        
        //if the  status is dangerous => checjk the counters before flagging it & senting alerts

        if (siteClassification30 === "danger") {
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
