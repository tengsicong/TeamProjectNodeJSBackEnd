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
            // .populate( 'MeetingID')
            .populate({path: 'MeetingID',populate:{ path: 'GroupID' }})
            .populate('StaffID')
            .populate('NewStaffID')
            .exec()
    },
    createStaffMeetingRequest: function createStaffMeetingRequest (changeStaffMeetingRequest) {
        return changestaffmeetingrequest
            .create(changeStaffMeetingRequest)
    },

    adminApproveRequest: function adminEditPendingStatusTimetable (id) {
        return changestaffmeetingrequest
            .findOneAndUpdate({_id: id},{$set:{Status: 'approved'}})

    },

    adminRejectRequest: function adminRejectRequest (command) {
        return changestaffmeetingrequest
            .findOneAndUpdate({_id: command.id}, {$set: {Status: command.Status, AdminReply: command.AdminReply}},{new:true})
            .exec()
    },

    // getChangeStaffMeetingRequestByChangeStaffMeetingRequestID: function getChangeStaffMeetingRequestByChangeStaffMeetingRequestID(id) {
    //     return changestaffmeetingrequest
    //         .findOne({_id:id})
    //         .populate('GroupID')
    //         // .populate('ClientID')
    // },

};
