const System = require('../systemShared')
const nextError = require('../../helpers/errorTypeFunction');
const _ = require('lodash');
const ApiError = require('../../error/api-error');
const { db} = require('../../models');
const MailService = require("../sendMailService/sendMail");

//#region Client
const createStaffUser = async ({ firstName, lastName, email, password, phoneOne, phoneTwo, role, permissions }) => {
    try {
        const staff = await System.createSystemUsers({ firstName, lastName, email, password, phoneOne, phoneTwo, roles: [role],permissions })
        return {
            result: true,
            message: 'staff created successfully',
            data: _.omit(staff, ['password', 'otp', 'updatedAt', '__v', '_id'])
        }
    } catch (error) {
        nextError(error);
    }
};
const updateStaffUser = async (staffId, body) => {
    try {
        const staff = await db.User.findById(staffId)
        if (body.status && ['Active', 'Suspended'].includes(body.status) && staff.status == "Pending") {
            throw ApiError.forbidden('User must activate account first');
        }
        const newStaff = await db.User.findByIdAndUpdate(staffId, { $set: { ...body } }, { new: true })
        return {
            result: true,
            message: 'User updated successfully',
        }
    } catch (error) {
        nextError(error);
    }
};
const getStaffUsers = async (body) => {
    try {
        const clients = await db.User.get(body)
        return {
            result: true,
            message: 'User data fetched successfully',
            data: clients
        }
    } catch (error) {
        nextError(error);
    }
}
const getStaffUser = async (staffId) => {
    try {
        const staff = await db.User.findById(staffId)
        const staffData = {
            ...staff._doc,
            id: staff._id
        }
        if (staff.isDeleted)
            throw ApiError.badRequest('User not found');
        return {
            result: true,
            message: 'User fetched successfully',
            data: _.omit(staffData, ['password', 'otp', 'updatedAt', '__v'])
        }
    } catch (error) {
        nextError(error);
    }
}

const suspendStaffUser = async (staffId) => {
    try {
        const result = await updateStaffStatus(staffId, 'Suspended')
        return result;
    } catch (error) {
        nextError(error);
    }
}

const activateStaffUser = async (staffId) => {
    try {
        const result = await updateStaffStatus(staffId, 'Active')
        return result;
    } catch (error) {
        nextError(error);
    }
}


const updateStaffStatus = async (staffId, status) => {
    try {
        const staff = await db.User.findById(staffId)

        if (staff.isDeleted)
            throw ApiError.badRequest('User is already deleted');

        if (staff.status === status)
            throw ApiError.badRequest(`User is already ${status}`);

        staff.status = status
        await staff.save();
        return {
            result: true,
            message: 'User status updated successfully',
        }
    } catch (error) {
        nextError(error);
    }
}

const deleteStaffUser = async (staffId) => {
    try {
        const staff = await db.User.findById(staffId)
        if (staff.isDeleted)
            throw ApiError.badRequest('User is already deleted');
        staff.isDeleted = true;
        await staff.save();
        return {
            result: true,
            message: 'User deleted successfully',
        }
    } catch (error) {
        nextError(error);
    }
}
//#endregion Client


module.exports = {
    createStaffUser,
    getStaffUsers,
    getStaffUser,
    deleteStaffUser,
    suspendStaffUser,
    activateStaffUser,
    updateStaffUser,

}