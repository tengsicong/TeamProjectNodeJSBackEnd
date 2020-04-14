const mongo = require('../lib/mongo');
const staffmeetings = mongo.staff_meetings;
const student = mongo.students;
const staff = mongo.staffs;
let mongoose = require('mongoose');


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

    getStaffMeetingByMeetingID: function getStaffMeetingByMeetingID(id) {
        return staffmeetings
            .findOne({_id: id})
            .populate('GroupID')
            .populate('StaffID')
    },

    createStaffMeeting: function createStaffMeeting(staffID, groupID, date, place, number) {
        return staffmeetings
            .create({StaffID: staffID, GroupID: groupID, Date: date, Place: place, MeetingNumber: number})
    },
    deletePreStaffMeeting: function deletePreStaffMeeting(staffmeetingIDList) {
        return staffmeetings
            .findOneAndDelete({_id: staffmeetingIDList})
    },

    editStaffMeetingTimeByStaffMeetingID: function editStaffMeetingTimeByStaffMeetingID(id, newTime) {
        return staffmeetings
            .update({_id: id}, {$set: {Date: newTime}}, {new: true})
            .exec()
    },

    editStaffMeetingNewStaffByStaffMeetingID: function editStaffMeetingNewStaffByStaffMeetingID(id, newStaffID) {
        return staffmeetings
            .update({_id: id}, {$set: {TemporaryStaffID: newStaffID}}, {new: true})
            .exec()
    },

    updateStaffMeetingRecordByMeetingID: function updateStaffMeetingRecordByMeetingID(id,rid) {
        return staffmeetings.update({_id:id},{$set:{RecordID:rid}});
    },

    // updateTeamMark: function updateTeamMark(id,reason,score){
    //     return team.update({_id:id},{$set:{StaffMark:score, StaffMarkReason:reason}});
    // },
};
