const Notification = require("../models/notification");

const addToNotification = ({
    userId,
    title,
    description,
    resourceId,
    resourceType,
    icon,
    route
})=>{
    new Notification({
        title,
        description,
        userId,
        ...(icon && {icon}),
        ...(route && {route}),
        ...(resourceId && {resourceId}),
        ...(resourceType && {resourceType}),
    }).save();
}

module.exports = addToNotification;