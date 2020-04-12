const mongo = require('../lib/mongo');
const staffmeetings = mongo.staff_meetings;
const student = mongo.students;
const staff = mongo.staffs;
const mongoose = require('mongoose');


module.exports = {
    getStaffMeetingByStaffID: function getStaffMeetingByStaffID(id) {
        return staffmeetings
            .find({StaffID: id})
            .populate('StaffID')
            .populate('GroupID')
            .exec()
    },
    getAllStaffMeetings: function getAllStaffMeetings() {
        return staffmeetings
            .find()
            .populate('GroupID')
            .populate('StaffID')
            .exec()
    },

    deleteStaffMeetingByGroupID: function deleteStaffMeetingByGroupID(GroupID) {
        return staffmeetings
            .deleteMany({GroupID:GroupID})
            .exec()
    }
};
