const mongo = require('../lib/mongo');
const staffmeetingrecords = mongo.staff_meeting_records;
const mongoose = require('mongoose');

module.exports = {

    updateMeetingRecords: function updateMeetingRecords(id,newRecords){
        return staffmeetingrecords.update({_id:id},{$set:{
            LastMeetingNote: newRecords.LastMeetingNote,
            AchievePlan: newRecords.AchievePlan,
            Change: newRecords.Change,
            ChangeOther: newRecords.ChangeOther,
            RequirementCapture: newRecords.RequirementCapture,
            TeamProgress: newRecords.TeamProgress,
            TimeSheets: newRecords.TimeSheets,
            ClearPlan: newRecords.ClearPlan,
            Dynamics: newRecords.Dynamics,
            AnyOtherNote: newRecords.AnyOtherNote,
        }});
    },

    createStaffMeetingRecord: function createStaffMeetingRecord (newRecords) {
        return staffmeetingrecords
            .create(newRecords)
    },

    deleteStaffMeetingRecordByRecordID: function deleteChangeStaffMeetingRequestByMeetingID(id) {
        return staffmeetingrecords
            .deleteOne({_id:id})
            .exec()
    }

};