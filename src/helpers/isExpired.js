function isExpired(date) {
    // Define your constant expiration duration in milliseconds
    
    if(date === "Invalid date" || !date){
      return true;
    }
    const expirationDuration =5 * 24 * 60 * 60 * 1000; // 24 hours
  
    // Get the current timestamp in milliseconds
    const currentTimestamp = new Date().getTime();
    const parsedDate = new Date(date);

    // Calculate the timestamp when the date will expire
    const expirationTimestamp = parsedDate.getTime() + expirationDuration;
  
    // Compare the expiration timestamp with the current timestamp
    if (currentTimestamp < expirationTimestamp) {
        
        return false; // Not expired
    } else {
        
      return true; // Expired
    }
  }
  

  module.exports = isExpired