const deviceService = require("../service/systemManagement/deviceService");
const {
  INTERVAL_TO_CHECK_DEVICE_STATUS,
  TIME_TO_GO_OFFLINE,
} = require("../config/systemManagement/TimeToGoOffline");

const verifyDevicesConnectivity = async () => {
  const now = Date.now();
  const devices = await deviceService.getDevices(); //nextt: get it from the caching service
  for (const device of devices.data) {
    const timeElapsed = now - new Date(device.lastOnline).getTime();
    if (timeElapsed >= TIME_TO_GO_OFFLINE) {
      if (device.status === "online") {
        deviceService
          .updateDevice("", device._id, { status: "offline" })
          .then((modified_device) => {
            //we can apply the alert logic here!
            console.log(`Device ${device._id} marked as offline`);
          })
          .catch((error) => {
            logger.error(
              `Error marking device ${device._id} as offline: ${error}`
            );
          });
      }
    } else {
      if (device.status === "offline") {
        deviceService
          .updateDevice("", device._id, { status: "online" })
          .then((modified_device) => {
            //we can apply the alert logic here!
            console.log(`Device ${device._id} marked as online`);
          })
          .catch((error) => {
            logger.error(
              `Error marking device ${device._id} as offline: ${error}`
            );
          });
      }
    }
  }
};

module.exports = verifyDevicesConnectivity;
