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
    adminEditPendingStatusTimetable: function adminEditPendingStatusTimetable (newChangeStaffMeetingRequest) {
        return changestaffmeetingrequest
            .update({_id:newChangeStaffMeetingRequest._id},{$set:{Status:newChangeStaffMeetingRequest.Status}})
    },
    adminRejectPendingStatusTimetable: function adminRejectPendingStatusTimetable (newChangeStaffMeetingRequest) {
        return changestaffmeetingrequest
            .update({_id:newChangeStaffMeetingRequest._id},{$set:{Status:newChangeStaffMeetingRequest.Status}})
    },
    createRequestReason: function createRequestReason (request) {
        return changestaffmeetingrequest
            .create(request)
    },

    // getChangeStaffMeetingRequestByChangeStaffMeetingRequestID: function getChangeStaffMeetingRequestByChangeStaffMeetingRequestID(id) {
    //     return changestaffmeetingrequest
    //         .findOne({_id:id})
    //         .populate('GroupID')
    //         // .populate('ClientID')
    // },

};
