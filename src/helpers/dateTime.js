

const dateToYrMDd = (date) => {

    const d = new Date(date);
    const yr = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    if (day < 10)
        return `${yr}-${m}-0${day}`;
    return `${yr}-${m}-${day}`;
}

const getDayName = (date) => {
    //my region
    const day = new Date(date).toLocaleString(
        "en-US",
        { weekday: "long" }
    )
    const dayName = day.charAt(0).toLowerCase() + day.slice(1);
    return dayName;

}

const dateToHrMn = (date) => {

    //split the hr:min
    const dayDate = new Date(date)
    const time = dayDate.toISOString().split(":");
    const dateHour = time[0];
    const hour = dateHour.split('T')[1]
    const minute = time[1];
    return `${hour}:${minute}`;
}
 
function isDateBetween(date, startDate, endDate) {
}

const differenceInDays = (dateOne, dateTwo) => {

    const diffTime = Math.abs(dateTwo - dateOne);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;

}

function changeTimezone(date, ianatz) {

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: ianatz
    }));

    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();

    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff); // needs to substract

}

const convertTimeToAmAndPm = (time) => {
    const timeArray = time.split(':');
    const hour = timeArray[0];
    const minute = timeArray[1];
    const amPm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${amPm}`;
}
module.exports = {
    dateToYrMDd,
    getDayName,
    dateToHrMn,
    isDateBetween,
    differenceInDays,
    convertTimeToAmAndPm
}

// const dateToYrMDd = (date) => {
    
//     const d = new Date(date);
//     const yr = d.getFullYear();
//     const m = d.getMonth() + 1;
//     const day = d.getDate();
//     return `${yr}-${m}-${day}`;
// }
// let day = new Date('2023-3-25')
// let today = new Date(dateToYrMDd(new Date()))
// const differenceInDays = (dateOne, dateTwo) => {

//     const diffTime = Math.abs(dateTwo - dateOne);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;

// }


// console.log(differenceInDays
//     (day, today)
// );

