const mongo = require('../lib/mongo');
const staff = mongo.staffs;
const proposal = mongo.proposals;
const team = mongo.teams;
const meeting = mongo.staff_meetings
const request = mongo.change_staff_meeting_requests
const meetingrecord = mongo.staff_meeting_records

// console.log('start')
// staff
//     .find()
//     .populate('GroupID')
//     .exec()
//     .then(function(result) {
//         console.log(result[0]);
//         console.log('end');
//     });

// module.exports={
//
// }

module.exports = {
    /**
     * @param {ObjectId} id
     * @return {[teams]} allocated team
     */
    getAllocatedTeamByStaffID: function getAllocatedTeamByStaffID(id) {
        return team
            .find({StaffID: id})
            .populate('StaffID','Name')
            .populate('StudentID','Name')
            .populate('Representer','Name')
            .populate({path: 'ProposalID', populate: {path: 'ClientID',select: 'Name'}})
            .populate({path: 'StaffMeetingID',populate: {path:'StaffID'}})
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {meeting} a meeting
     */
    getStaffMeetingByMeetingID: function getStaffMeetingByMeetingID (id) {
        return meeting
            .findById(id)
            .populate('TemporaryStaffID')
            .populate('StaffID')
            .populate({path:'GroupID', populate:{path: 'StudentID'}})
            .populate({path:'GroupID', populate:{path: 'ProposalID', populate: {path:'ClientID'}}})
            .populate('RecordID')
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {meetingmodify} a meeting changing request
     */
    getStaffMeetingChangeRequestByMeetingID: function getStaffMeetingChangeRequestByMeetingID (id) {
        return request
            .findOne({MeetingID: id})
            .exec();
    },
    /**
     * @param {ObjectId} id
     * @return {staffs} a project
     */
    getStaffByStaffID: function getProjectByStaffID(id) {
        return staff
            .findById(id)
            .exec();
    },

    /**
     * @param {String} name, staff's user name which is usually an email address
     * @return {staffs} a staff object
     */
    getStaffByUserName: function getStaffByUserName(name) {
        return staff
            .findOne({UserName: name})
            .exec();
    },

    /**
     * @return {[staffs]} staff object
     */
    getAllStaff: function getAllStaff() {
        return staff
            .find()
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {[meeting]} staff object
     */

    getAllMeetingByStaffID: function getAllMeetingByStaffIDf(id) {
        return meeting
            .find({StaffID: id})
            .populate('GroupID')
            .exec();
    },

    resetPasswordByStaffId: function resetPasswordByStaffId(id, password) {
        return staff.findByIdAndUpdate(id, { Password: password });
    }
};
