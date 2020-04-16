const mongo = require('../lib/mongo');
const staffmeetings = mongo.staff_meetings;
const student = mongo.students;
const staff = mongo.staffs;
const mongoose = require('mongoose');
const changestaffmeetingrequest = mongo.change_staff_meeting_requests;


module.exports = {

    getAllChangeStaffMeetingRequest: function getChangeAllStaffMeetingRequest() {
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

    adminApproveRequest: function adminApproveRequest (id) {
        return changestaffmeetingrequest
            .findOneAndUpdate({_id: id},{$set:{Status: 'approved'}})

    },

    adminRejectRequest: function adminRejectRequest (requestID, adminName, comment) {
        return changestaffmeetingrequest
            .findOneAndUpdate({_id: requestID}, {$set: {Status: 'rejected', AdminReply: {AdminName: adminName, Date: new Date(), Content: comment}}},{new:true})
            .exec()
    },
};
