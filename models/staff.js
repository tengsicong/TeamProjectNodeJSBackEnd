const mongo = require('../lib/mongo');
const staff = mongo.staffs;
const team = mongo.teams;
const meeting = mongo.staff_meetings;
const request = mongo.change_staff_meeting_requests;
const students = mongo.students;

module.exports = {

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
     * @return {[teams]} allocated teams
     */
    getAllocatedTeamByStaffID: function getAllocatedTeamByStaffID(id) {
        return team
            .find({StaffID: id})
            .populate('StaffID','Name')
            .populate('StudentID','Name StaffMark StaffFeedback')
            .populate('Representer','Name')
            .populate('ProposalID','Content')
            .populate({path: 'ProposalID', populate: {path: 'ClientID'}})
            .populate({path: 'StaffMeetingID',populate: {path:'StaffID'}})
            .populate({path: 'StaffMeetingID',populate: {path:'TemporaryStaffID'}})
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {teams} an allocated team
     */
    getAllocatedTeamByTeamID: function getAllocatedTeamByTeamID(id) {
        return team
            .findById(id)
            .populate('StaffID','Name')
            .populate('StudentID')
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
     * @return {[meeting]} meeting List
     */

    getStaffMeetingByStaffID: function getStaffMeetingByStaffIDf(id) {
        return meeting
            .find({StaffID: id})
            .populate('GroupID')
            .populate('StaffID')
            .populate('TemporaryStaffID')
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {[meeting]} meeting List
     */

    getStaffMeetingByTempStaffID: function getStaffMeetingByTempStaffID(id) {
        return meeting
            .find({TemporaryStaffID: id})
            .populate('GroupID')
            .exec();
    },

    /**
     * @param {ObjectId} id
     * @return {[meetingmodify]} a list of meeting changing request
     */
    getStaffMeetingChangeRequestByMeetingID: function getStaffMeetingChangeRequestByMeetingID (id) {
        return request
            .find({MeetingID: id})
            .populate('StaffID')
            .populate('NewStaffID')
            .exec();
    },
    /**
     * @param {ObjectId} id
     * @return {[meetingmodify]} a list of meeting changing request
     */
    getStaffMeetingChangeRequestByStaffID: function getStaffMeetingChangeRequestByStaffID (id) {
        return request
            .find({StaffID: id})
            .populate('StaffID')
            .populate('NewStaffID')
            .populate('MeetingID')
            .exec();
    },

    updatePasswordByStaffId: function updatePasswordByStaffId(id, password) {
        return staff.findByIdAndUpdate(id, { Password: password });
    },

    /**
     * @param {ObjectId} id, GroupID  id:staffID
     * @return {staff} a staff object
     */
    updateAllocatedTeamByTeamID: function updateAllocatedTeamByTeamID(id,GroupID) {
        return staff.update({_id:id},{$addToSet:{AllocatedTeamID: GroupID}});

    },

    updateTeamMark: function updateTeamMark(id,reason,score){
        return team.update({_id:id},{$set:{StaffMark:score, StaffMarkReason:reason}});
    },

    updateIndeMark: function updateIndeMark(id,score,reason){
        return students.update({_id:id},{$set:{StaffMark:score,StaffMarkReason: reason}});
    },

    updateMeetingChangeRequest: function updateMeetingChangeRequest(newRequest){
        return request.update({_id:newRequest._id},{$set:{NewStaffID:newRequest.NewStaffID, NewMeetingTime:newRequest.NewMeetingTime, RequestComment: newRequest.RequestComment}});
    },

    createMeetingChangeRequest: function createMeetingChangeRequest(newRequest) {
        return request.create(newRequest);
    },

    addNewStaff:function addNewStaff(addStaffName, addStaffUserName) {
        // .populate('Name')
        return staff.create({Name: addStaffName, UserName: addStaffUserName, Password: addStaffName});
    },

    deleteAllocatedTeamByTeamID : function deleteAllocatedTeamByTeamID(id,groupID) {
        return staff.update({_id:id},{$pull:{AllocatedTeamID: {$in:groupID}}});
    },

    /**
     * @author: wang
     */
    postGroupIDByStaffID: function postGroupIDByStaffID(staffID, groupID) {
        return staff
            .findOneAndUpdate({_id: staffID}, {$addToSet: {AllocatedTeamID: groupID}})
            .exec()
    },
    deletePreGroupID: function deletePreGroupID(preStaffID) {
        return staff
            .findOneAndUpdate({_id: preStaffID},{$unset:{AllocatedTeamID: ['']}})
            .exec()
    },
    addNewStaffGroupID: function addNewStaffGroupID(staffID, groupID) {
        return staff
            .findOneAndUpdate({_id: staffID},{$addToSet:{AllocatedTeamID:[groupID] }},{new: true})
            .exec()
    }
};
