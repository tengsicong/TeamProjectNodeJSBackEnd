const mongo = require('../lib/mongo');
const staffmeetings = mongo.staff_meetings;
const student = mongo.students;
const staff = mongo.staffs;
const mongoose = require('mongoose');
const changestaffmeetingrequest = mongo.change_staff_meeting_requests;


module.exports = {

    getChangeStaffMeetingRequest: function getChangeStaffMeetingRequest() {
        return changestaffmeetingrequest
            .find()
            .populate( 'MeetingID')
            .populate('StaffID')
            .exec()
    }
};
