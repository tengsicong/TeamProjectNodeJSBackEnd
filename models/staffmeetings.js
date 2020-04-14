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
            .deleteMany({GroupID: GroupID})
            .exec()
    },
    addStaffMeeting1: function addStaffMeeting1(addStaffID) {
        staffmeetings
            .create({StaffID: addStaffID, MeetingNumber: 1, Date: Date('2012-11-04T07:58:51.000+0000'),})
    },
    addStaffMeeting2: function addStaffMeeting2(addStaffID) {
        staffmeetings
            .create({StaffID: addStaffID, MeetingNumber: 2, Date: Date('2012-11-04T07:58:51.000+0000')})
    },
    addStaffMeeting3: function addStaffMeeting3(addStaffID) {
        staffmeetings
            .create({StaffID: addStaffID, MeetingNumber: 3, Date: Date('2012-11-04T07:58:51.000+0000')})
    },
    addStaffMeeting4: function addStaffMeeting4(addStaffID) {
        staffmeetings
            .create({StaffID: addStaffID, MeetingNumber: 4, Date: Date('2012-11-04T07:58:51.000+0000')})
    },
    addStaffMeeting5: function addStaffMeeting5(addStaffID) {
        staffmeetings
            .create({StaffID: addStaffID, MeetingNumber: 5, Date: Date('2012-11-04T07:58:51.000+0000')})
    },

    getStaffMeetingByMeetingID: function getStaffMeetingByMeetingID(id) {
        return staffmeetings
            .findOne({_id:id})
            .populate('GroupID')
            .populate('StaffID')
    },

    updateStaffMeetingRecordByMeetingID: function updateStaffMeetingRecordByMeetingID(id,rid) {
        return staffmeetings.update({_id:id},{$set:{RecordID:rid}});
    },

    // updateTeamMark: function updateTeamMark(id,reason,score){
    //     return team.update({_id:id},{$set:{StaffMark:score, StaffMarkReason:reason}});
    // },
};
