 function frequent(array){
    const count = {};

  for (const element of array) {
    count[element] = (count[element] || 0) + 1;
  }

  let mostFrequentElement = null;
  let maxCount = 0;

  for (const element in count) {
    if (count[element] > maxCount) {
      mostFrequentElement = element;
      maxCount = count[element];
    }
  }

  return mostFrequentElement;
}

module.exports = frequent