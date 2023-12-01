const { FDI_THRESHOLDS } = require("../config/FdiThresholds");

function findIndexByType(value) {
  for (const key in FDI_THRESHOLDS) {
    if (FDI_THRESHOLDS.hasOwnProperty(key)) {
      if (FDI_THRESHOLDS[key].type === value) {
        return FDI_THRESHOLDS[key].level;
      }
    }
  }
  return -1; // Return -1 if the type is not found
}
function calculateMetricDanger(metric, value) {
  if (metric.toLowerCase() === "humidity") {
    if (value > 30) {
      return 3;
    } else {
      return 1;
    }
  }
  if (metric.toLowerCase() === "windspeed") {
    if (value >= 30) {
      return 3;
    } else {
      return 1;
    }
  }
  if (metric.toLowerCase() === "temperature") {
    if (value >= 30) {
      return 3;
    } else {
      return 1;
    }
  }
  if (metric.toLowerCase() === "percipitation") {
    if (value >= 30) {
      return 3;
    } else {
      return 1;
    }
  }
  if (metric.toLowerCase() === "fdi") {
    return findIndexByType(value.toLowerCase());
  }
  if (metric.toLowerCase() === "rule30") {
    if (value.toLowerCase === "good") {
      return 1;
    } else {
      return 3;
    }
  }
  return 1;
}

module.exports = calculateMetricDanger;
