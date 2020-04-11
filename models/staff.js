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
            .populate('ProposalID','Content')
            .populate({path: 'ProposalID', populate: {path: 'ClientID'}})
            .populate({path: 'StaffMeetingID',populate: {path:'StaffID'}})
            .populate({path: 'StaffMeetingID',populate: {path:'TemporaryStaffID'}})
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
            .populate('StaffID')
            .populate('NewStaffID')
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {team} a team
     */
    getTeamByTeamID: function getTeamByTeamID (id) {
        return request
            .findById(id)
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
     * @param {String} name
     * @return {staffs} a staff object
     */

    getStaffByName: function getStaffByName(name) {
        return staff
            .findOne({Name: name})
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
     * @return {[meeting]} meeting List
     */

    getAllMeetingByStaffID: function getAllMeetingByStaffID(id) {
        return meeting
            .find({StaffID: id})
            .populate('GroupID')
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {[meeting]} meeting List
     */

    getAllMeetingByTempStaffID: function getAllMeetingByTempStaffID(id) {
        return meeting
            .find({TemporaryStaffID: id})
            .populate('GroupID')
            .exec();
    },

    resetPasswordByStaffId: function resetPasswordByStaffId(id, password) {
        return staff.findByIdAndUpdate(id, { Password: password });
    },


    /**
     * @param {ObjectId} id, GroupID  id:staffID
     * @return {staff} a staff object
     */
    updateStaffAllocatedTeamByTeamID: function updateStaffAllocatedTeamByTeamID(id,GroupID) {
        return staff.update({_id:id},{$addToSet:{AllocatedTeamID: GroupID}})

    },


    updateTeamMark: function updateTeamMark(id,reason,score){
        return team.update({_id:id},{$set:{StaffMark:score, StaffMarkReason:reason}});
    },

    updateMeetingChangeRequest: function updateMeetingChangeRequest(newRequest){
        return request.update({_id:newRequest._id},{$set:{NewStaffID:newRequest.NewStaffID, NewMeetingTime:newRequest.NewMeetingTime, RequestComment: newRequest.RequestComment}});
    },

    createMeetingChangeRequest: function createMeetingChangeRequest(newRequest) {
        return request.create(newRequest);
    },
};
