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

};
